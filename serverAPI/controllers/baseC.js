// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
// https://jscompress.com/
// http://javascriptcompressor.com/

/**
 * baseC.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

const AppDebug = require(ROOT_PATH+'/lib/appDebug.js');
const Constants = require(ROOT_PATH+'/lib/constants.js');
const Configs = require(ROOT_PATH+'/config/configs.js');
const dbconnMyssql = require(ROOT_PATH+'/lib/dbconnMysql.js');
const cacheManager = require(ROOT_PATH+'/lib/cacheManager.js');
const securityManager = require(ROOT_PATH+'/lib/securityManager.js');
const Utils = require(ROOT_PATH+'/lib/utils.js');
const Rooter = require(ROOT_PATH+'/config/rootes.js');
const logger = require(ROOT_PATH+'/lib/logger.js');

var Cnts = [];
var cntSign = '_ctrl';
global.isConnRelease = true;
global.liveTime = new Date().getTime();
global.actStartTime = global.liveTime;
global.actEndTime = global.liveTime;
var fs = require('fs')
fs.readdirSync(__dirname + Constants.SLASH).forEach(function(file) {
    if (file.match(/\.js$/) !== null && file !== 'base_ctrl.js' && file !== 'baseC.js') {
      var name = file.replace('.js', Constants.BLANK);
      Cnts[name] = require('./' + file); 
    }else{
        var __d = __dirname + Constants.SLASH + file
        if (fs.statSync(__d).isDirectory()) {
            AppDebug.log(file);
            fs.readdirSync(__d + Constants.SLASH).forEach(function(__f) {
                if (__f.match(/\.js$/) !== null) {
                  var name = __f.replace('.js', Constants.BLANK);
                  Cnts[name] = require('./' + file + Constants.SLASH + __f); 
                }
            })
        }
    }
});

module.exports = function(options) {
    return function(req, res, next) {        
        var appKey = req.headers.appkey;
        var userKey = req.headers.userkey;
        if(Utils.isEmpty(appKey)){
            next();
        }else{
            const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            securityManager.validateAppKey(appKey,ip , function(err, result){
                if(!err){
                    if(Utils.isEmpty(userKey)){
                        actionFn(req, res, next);
                    }else{
                        securityManager.validateUserKey(userKey, function(err, result){
                            if(!err){
                                actionFn(req, res, next);
                            }else{
                                next();
                            }
                        })
                    }
                }else{
                    next();
                }
            });
        }
        function actionFn (req, res, next) {  
            if(Configs.env != 'live'){
                var duration = new Date().getTime();
                duration = duration - liveTime;
                if(duration>3600000*18){
                    isConnRelease = false;
                }
            }
            var path = req.path;
            if(path !=Constants.BLANK && path !=Constants.SLASH){
                AppDebug.log('path: '+path);
                path = path.substr(1);
                var cntSt = Constants.BLANK;
                var methodSt = Constants.BLANK;
                var id = Constants.BLANK;
                if(path.indexOf(Constants.SLASH)>0){
                    cntSt = path.substr(0, path.indexOf(Constants.SLASH));
                    path = path.substr(path.indexOf(Constants.SLASH)+1);
                    if(path.indexOf(Constants.SLASH)>0){
                        methodSt = path.substr(0, path.indexOf(Constants.SLASH));
                        path = path.substr(path.indexOf(Constants.SLASH)+1);
                        id = path;
                    }else{
                        methodSt = path;
                    }    
                }else{
                    cntSt = path;
                }
                AppDebug.log('cntSt: '+cntSt);
                AppDebug.log('methodSt: '+methodSt);
                AppDebug.log('id: '+id);
                if(id != Constants.BLANK)req.body.id=id;
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
                if(cntSt!='' && undefined != Cnts[cntSt+cntSign]){
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
                                next();
                                AppDebug.log(err);
                            }else{
                                if(fprocess && isFpw){
                                    cacheManager.init(connection);
                                    var session = {};
                                    var url = cntSt+Constants.SLASH+methodSt;
									if(cntSt=='queue') userKey = 0;
                                    // TODO: Utils.isEmpty(userKey) || 
                                    //if(!userKey || Configs.login_action == url || Configs.login_action2 == url){
                                    if(!userKey){
                                        if(fprocess){
                                            try{
                                                var cnt = new Cnts[cntSt+cntSign]();
                                                cnt.beforeFilter(connection, req, res, next, session);
                                                // controller call action method
                                                cnt[methodSt](id); 
                                            }catch(err){
                                                connection.release();
                                                logger.error(err, methodSt);
                                            }
                                        }
                                        logger.info(appKey, url); 
                                    }else{
                                        AppDebug.log('userKey');
                                        AppDebug.log(userKey);
                                        // get and create session
                                        cacheManager.get(userKey, function(err, result){
                                            session = result;
                                            if(!err && session && session.uinfo){
                                                try{
                                                    var cnt = new Cnts[cntSt+cntSign]();
                                                    cnt.beforeFilter(connection, req, res, next, session);
                                                    // controller call action method
                                                    cnt[methodSt](id);  

                                                    // update session
                                                    if(session && session.stime){
                                                        if(actStartTime-session.stime>(Configs.sessionLive*200)){
                                                            session.stime = actStartTime;
                                                            cacheManager.replace(userKey, session, Configs.sessionLive);
                                                        }
                                                    }
                                                    //console.log('session.stime-actStartTime', session.stime,actStartTime,session.stime-actStartTime)
                                                    if(session && session.uinfo){
                                                        logger.info(session.uinfo.username, url);
                                                    }else{
                                                        logger.info(appKey, url); 
                                                    }
                                                }catch(ex){
                                                    AppDebug.log(ex);
                                                    logger.info('errr request', url);
                                                    res.resData = {
                                                        "success": false,
                                                        "error": {
                                                            "code": 2000,
                                                            "message": "Must be login." },
                                                        "data": {}
                                                    }
                                                    connection.release();
                                                    next();
                                                }
                                            }else if(Configs.login_action == url || Configs.login_action2 == url){
                                                if(fprocess){
                                                    try{
                                                        var cnt = new Cnts[cntSt+cntSign]();
                                                        cnt.beforeFilter(connection, req, res, next, {});
                                                        // controller call action method
                                                        cnt[methodSt](id); 
                                                    }catch(err){
                                                        connection.release();
                                                        logger.error(err, methodSt);
                                                    }
                                                }
                                                logger.info(appKey, url); 
                                            }else{
                                                logger.info('no session', url);
                                                res.resData = {
                                                    "success": false,
                                                    "error": {
                                                        "code": 10000,
                                                        "message": "no session" },
                                                    "data": {}
                                                }
                                                connection.release();
                                                next();
                                            }
                                        });
                                    }
                                }else{
                                    connection.release();
                                    next();
                                }
                            }
                            //next();
                        })
                        /*var cnt = Cnts[cntSt+cntSign];
                        cnt.beforeFilter(req, res, next);
                        // controller call action method
                        cnt[methodSt](); */
                    }catch(ex){
                        AppDebug.log(ex);
                        next();
                    }
                }else{
                    AppDebug.log('Calling to controller not exist: '+cntSt+'. action: '+methodSt);
                    next();            
                }
            }else{
                AppDebug.log('Not root: '+path);
                next();
            }
        }
    }
}