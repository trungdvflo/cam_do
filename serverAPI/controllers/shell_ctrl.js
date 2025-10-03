/**
 * user controller.
 * create 2019/02/08
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
const Configs = require('../config/configs.js');
const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
const base_ctrl = require('../controllers/base_ctrl.js');
const logger = require('../lib/logger.js');
var baseModel = require('../models/baseModel.js');

module.exports = class user_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }
    index () { 
        var data = {
        };
        // TODO:
        this.responeData(data, true, 200, "success");
    }
    /**
     * save action
     * @author: trungdv
     */
    save () {
        
    }
    /**
     * find user action
     * common function
     * @author: trungdv
     */
    find () {
        var t = this;
        var data = {};
/*        var u = new userModel(t.db);
        u.pagingAsync(cond, orderby, page, Constants.ROW_PER_PAGE).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, this.constructor.name+".find");
            t.responeData(data, false, 301, "fail");
        })*/
        cacheManager.get('shells_options', function(err, result){
            t.responeData(result, true, 200, "success");
        })        
    }

    check_shells_run(){
        var t = this;
        cacheManager.get('shells_run', function(err, result){
            t.responeData(result, true, 200, "success");
        }) 
    }

    run_shells_run(){
        var t = this;
        cacheManager.get('shells_run', function(err, result){
            if(err){
                t.responeData(result, false, 300, "error");
            }else if(result!='active'){
                try{
                    const exec = require("child_process").exec
                    exec("node ./shells.js");
                    t.responeData(result, true, 200, "success");
                }catch(ex){
                    logger.error(ex, t.constructor.name+".run_shells_run");
                    t.responeData(result, false, 301, "error");
                }
            }else{
                t.responeData(result, true, 200, "running");
            }
        }) 
    }

    stop_shells_run(){
        var t = this;
        cacheManager.set('shells_run', 'stop', 5*60, function(){ // 5 phut
            t.responeData({}, true, 200, "success");
        }) 
    }
}