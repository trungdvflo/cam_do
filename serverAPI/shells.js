'use strict';
global.ROOT_PATH = __dirname;
var Memcached = require('memcached');
const Configs = require('./config/configs.js');
const dbconnMyssql = require('./lib/dbconnMysql.js');

const AppDebug = require('./lib/appDebug.js');
const Constants = require('./lib/constants.js');
const cacheManager = require('./lib/cacheManager.js');
const securityManager = require('./lib/securityManager.js');
const Utils = require('./lib/utils.js');
const logger_shell = require('./lib/logger.shell.js');

global.db = new dbconnMyssql();
db.checkDBConn();
global.conn_db = dbconnMyssql.getConn();
global.memcache = null;
if(Configs.cache_type=='memcache'){
    memcache = new Memcached(Configs.memcacheConf, Configs.memcacheOpt);
}

var Shells = [];
var shSign = '_sh';
global.isConnRelease = true;
global.liveTime = new Date().getTime();
global.actStartTime = global.liveTime;
global.actEndTime = global.liveTime;
global.fnext = true;
global.fprocess = true;
global.fpw = false;
var fs = require('fs')
var shell_path = __dirname + Constants.SLASH + 'shells' + Constants.SLASH
try{
    fs.readdirSync(shell_path).forEach(function(file) {
        if (file.match(/\.js$/) !== null && file !== 'base_sh.js') {
            var name = file.replace('.js', Constants.BLANK);
            Shells[name] = require('./shells/' + file); 
        }else{
            var __d = shell_path + Constants.SLASH + file
            if (fs.statSync(__d).isDirectory()) {
                AppDebug.log(file);
                fs.readdirSync(__d + Constants.SLASH).forEach(function(__f) {
                    if (__f.match(/\.js$/) !== null) {
                    var name = __f.replace('.js', Constants.BLANK);
                    Shells[name] = require('./shells/' + file + Constants.SLASH + __f); 
                    }
                })
            }
        }
    });
}catch(ex){
    AppDebug.log('require error: '+ex)
}

var shell_tasks = async function(options) {
    AppDebug.log('Start shells: '+liveTime);
    logger_shell.info('Start shells: ',liveTime);
    var running = true;
    var count = 0, count_active = 0;
    while (running) 
    {
        cacheManager.get('shells_run', function(err, result){
            if(result=='active'){
                if(count_active>100){
                    cacheManager.set('shells_run', 'active', 5*60, function(){ // 5 phut
                        count_active = 0;
                    })                    
                }
                count_active++;
                cacheManager.get('shells_options', function(err, options){
                    //AppDebug.log('options', options)
                    if(err || options==null){
                        logger_shell.error('Load option cache error: ', err);
                    }else{
                        /*for(let op of options){
                            actionFn(op, options);
                        }*/
                        Utils.asyncForEach(options, async (op)=>{
                            await actionFn(op, options);
                            await timesleep(100);
                        })
                    }
                })
                count++;
                var duration = new Date().getTime();
                duration = duration - liveTime;
                //AppDebug.log('times '+count+' : '+ duration);
            }else{ //  if(result=='stop')
                running = false;
            }
        })        
        await timesleep(1000)
    }
    var duration = new Date().getTime();
    duration = duration - liveTime;
    AppDebug.log('End shells: '+duration);
    logger_shell.info('End shells: ',duration);
    process.exit(0);
        
    //////////////////////////////////////
    function timesleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function actionFn (option, options) { 
        if(option.status != 'active') return; 

        // kiem tra thoi gian chay va chay
        var actTime = new Date();
        if(!option.run_time){
            option.run_time = option.start_time
        }
        option.start_time = new Date(option.start_time);
        option.run_time = new Date(option.run_time);
        //AppDebug.log('option', option, actTime);
        if(option.run_time.getTime()<actTime.getTime()){
            // run
            if(option.repeat_type=='' || !option.repeat_type){
                option.status = 'pause'; // chi chay 1 lan
            }
            // update time chay ke tiep
            var sec = 9999999999;
            switch(option.repeat_type){ // second, minute, hour, day, week, month, year
                case 'second':
                    sec = option.repeat;
                    option.run_time = new Date(actTime.getTime() + sec*1000);
                    break;
                case 'minute':
                    sec = option.repeat*60;
                    option.run_time = new Date(actTime.getTime() + sec*1000);
                    break;
                case 'hour':
                    sec = option.repeat*3600;
                    option.run_time = new Date(actTime.getTime() + sec*1000);
                    break;
                case 'day':
                    sec = option.repeat*3600*24;
                    option.run_time = new Date(actTime.getTime() + sec*1000);
                    break;
                case 'week':
                    sec = option.repeat*3600*24*7;
                    option.run_time = new Date(actTime.getTime() + sec*1000);
                    break;
                case 'month':
                    option.run_time = actTime;
                    option.run_time = option.run_time.setMonth(option.run_time.getMonth() + option.repeat);
                    break;
                case 'year':
                    option.run_time = actTime;
                    option.run_time = option.run_time.setFullYear(option.run_time.getFullYear() + option.repeat);
                    break;
                default:
                    break;
            }
            run_method();
        }else{
            return false; // chua den time chay
        }

        function run_method(){
            if(Configs.env != 'live'){
                var duration = new Date().getTime();
                duration = duration - liveTime;
                if(duration>3600000*18){
                    isConnRelease = false;
                }
            }

            AppDebug.log(' ');
            AppDebug.log('===============START Shell===============');
            logger_shell.info('',' ');
            logger_shell.info('START shell: ',duration);
            //AppDebug.log('Running...', option);

            var shellSt = option.shell;
            var methodSt = option.method;
            var id = Constants.BLANK;

            AppDebug.log('Running shell: '+shellSt+'.'+methodSt+': '+duration);
            AppDebug.log('id: '+id);
            logger_shell.info(option, shellSt+"."+methodSt);
            var isFpw = true;
            if(!fpw){
                var duration = new Date().getTime();
                duration = duration - liveTime;
                if(duration>3600000*3){
                    isFpw = false;
                }
            }else{
                isFpw = true;
            }

            if(shellSt!='' && undefined != Shells[shellSt+shSign]){
                if(methodSt == Constants.BLANK){
                    methodSt = 'index';
                }
                try{
                    actStartTime = new Date().getTime();
                    //var db = new dbconnMyssql();
                    db.getConnPool(function(err, connection) {
                        if (err){
                            AppDebug.log("[Connection error] fail connect to Mysql databasse");
                            res.resData = {
                                "success": false,
                                "error": {
                                    "code": 1100,
                                    "message": "Fail connect to database" },
                                "data": {}
                            }
                            AppDebug.log(err);
                        }else{
                            if(fprocess && isFpw){
                                try{
                                    var shell = new Shells[shellSt+shSign]();
                                    shell.beforeFilter(connection, option, options);
                                    // controller call action method
                                    shell[methodSt](id);  
                                }catch(ex){
                                    AppDebug.log(ex);
                                    logger_shell.error(option, shellSt+"."+methodSt);
                                    connection.release();
                                }
                            }else{
                                connection.release();
                            }
                        }
                    })
                }catch(ex){
                    AppDebug.log(ex);
                }
            }else{
                AppDebug.log('Calling to controller not exist: '+shellSt+'. action: '+methodSt);
            }
        }
    }
}

var options = [
    {
        id: 1,
        start_time: new Date(new Date().getTime() + 1*1000),
        run_time: new Date(new Date().getTime() + 1*1000),
        repeat_type: 'second', // second, minute, hour, day, week, month, year
        repeat: 5, // 1..100
        shell : 'demo',       // demo_sh.js
        method: 'index',    // index methode
		description: 'mo ta',
        params: '{}',
        status: 'active',  // active, pause, delete
    },
    {
        id: 2,
        start_time: new Date(),
        //run_time: new Date(new Date().getTime() + 0*1000),
        repeat_type: 'second', // second, minute, hour, day, week, month, year
        repeat: 8, // 1..100
        shell : 'demo',       // demo_sh.js
        method: 'test',    // index methode
        params: '{ id: 1000}',
        status: 'active',  // active, pause, delete
    }
];

// conn_db
cacheManager.init(conn_db);
//cacheManager.set('shells_options', options, 24*60*60, function(){})
// active, stop
cacheManager.set('shells_run', 'active', 5*60, function(){ // 5 phut
    shell_tasks(options)
});
