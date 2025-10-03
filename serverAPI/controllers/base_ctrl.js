/**
 * base controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

const Constants = require(ROOT_PATH+'/lib/constants.js');
const Utils = require(ROOT_PATH+'/lib/utils.js');
const AppDebug = require(ROOT_PATH+'/lib/appDebug.js');
const logger = require(ROOT_PATH+'/lib/logger.js');
var baseModel = require('../models/baseModel.js');

module.exports = class base_ctrl {
    beforeFilter(db, req, res, next, session){
        this.db = db;
        req.reqDb = db;
        this.next = next;
        this.res = res;
        this.req = req;
        this.session = session;
        global.hasInsert = false;
        this.noCheckSlowReq = false;
    }
    responeData(data, success, code, msg){
        this.res.resData = {
            "success": success,
            "error": {
                "code": code,
                "message": msg },
            "data": data
        };

        AppDebug.log('===============End Request===============');
        if(global.hasInsert){
            // var bModel = new baseModel(this.db, 'sequence');
            // bModel.nextSequence();
        }
        if(isConnRelease){
            if(this.db){
                try{
                    this.db.release();
                    //AppDebug.log('Release db connection');
                }catch(err){ logger.error(err, 'Can not release connection ' + this.req.path); }
            }
        }
        actEndTime = new Date().getTime();
        if(!this.noCheckSlowReq){
            var reqDuration = actEndTime - actStartTime
            AppDebug.log('actStartTime-actEndTime: ' + reqDuration);
            if(reqDuration>2000){
                logger.error('SLOW REQUEST: '+reqDuration, this.req.path);
                logger.error('SLOW REQUEST Data: ', this.req.body); 
            }
        }
        //AppDebug.log('global.hasInsert = ' + global.hasInsert);
        
        this.next();
    }

    hasPermission(per){
        AppDebug.log('check Permission');
        var acls = this.session.acls;
        if(!acls){
            return false;
        }else if(acls.user_id == Constants.allow_uid){
            return true;
        }else{
            if(!Utils.isSet(per)){
                var path = this.req.path;
                path = path.substr(1);
                var _ctrlSt = Constants.BLANK;
                var methodSt = Constants.BLANK;
                if(path.indexOf(Constants.SLASH)>0){
                    _ctrlSt = path.substr(0, path.indexOf(Constants.SLASH));
                    path = path.substr(path.indexOf(Constants.SLASH)+1);
                    if(path.indexOf(Constants.SLASH)>0){
                        methodSt = path.substr(0, path.indexOf(Constants.SLASH));
                        path = path.substr(path.indexOf(Constants.SLASH));
                    }else{
                        methodSt = path;
                    }    
                }else{
                    _ctrlSt = path;
                }
                per = _ctrlSt + Constants.SLASH + methodSt;
            }

            if (typeof per === 'string') {
                if(acls.action_names && acls.action_names.indexOf(per)>=0){
                    return true;
                }else{
                    return false;
                }
            }else if(Array.isArray(per)){
                let res = false;
                for(let i in per){
                    if(acls.action_names && acls.action_names.indexOf(per[i])>=0){
                        res = true;
                    }
                }
                return res;
            }else{
                return false
            }
        }
    }
}
