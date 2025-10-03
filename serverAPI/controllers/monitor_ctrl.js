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
     * find user action
     * common function
     * @author: trungdv
     */
    status () {
        var t = this;
        var data = {};
        var res = {};
        // kiem tra xem da co ai dang chay tu dong khong?
        cacheManager.get(Configs.batcher_id, function(err, result){
            if(result == null || result == undefined || err){
                // khong co ai chay     
                res.dot_kham = false  
            }else{
                res.dot_kham = true
            }
            cacheManager.get('shells_run', function(err, result){
                res.shells_run = false
                if(err){
                }else if(result=='active'){
                    res.shells_run = true
                }
                t.responeData(res, true, 200, "success");
            })
        })
    }

}