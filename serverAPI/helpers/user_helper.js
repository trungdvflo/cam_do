/**
 * user controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
const Configs = require(ROOT_PATH+'/config/configs.js');
const Constants = require(ROOT_PATH+'/lib/constants.js');
const Utils = require(ROOT_PATH+'/lib/utils.js');
const AppDebug = require(ROOT_PATH+'/lib/appDebug.js');
const cacheManager = require(ROOT_PATH+'/lib/cacheManager.js');
const logger = require(ROOT_PATH+'/lib/logger.js');
var baseModel = require(ROOT_PATH+'/models/baseModel.js');
var userBranchModel = require('../models/user_branchModel.js');

module.exports = class user_helper {
    /**
     * kich 1 user, clear session of user
     * @param {* user (object)} user 
     */
    static kick_out(user){
        // manage list session key of user
        cacheManager.get(Constants.SESS_UKEYS + user.username, function(err, result){
            if(result){
                // delete all session
                for(let key in result){
                    cacheManager.delete(key);
                }
            }
            cacheManager.delete(Constants.SESS_UKEYS + user.username);
        });
    }

    /**
     * add 1 session in to cache, for login,..
     * @param {* new session is added} session 
     * @param {* function} callback 
     */
    static add_sess(session, callback){
        cacheManager.get(Constants.SESS_UKEYS + session.uinfo.username, function(err, result){
            if(!result || result.length<1){
                result = {};
            }else{
                var ids = [];
                for(let k in result){
                    ids.push(k);
                }
                if(ids.length>20){
                    var i=0;
                    for(let id of ids){
                        cacheManager.delete(id);
                        delete result[id];
                        i++;
                        if(i>6) break; // xoa 6 sec dau tien
                    }
                }
            }
            //result.push(session.id);
            result[session.id] = {
                '_time':actStartTime
            }
            cacheManager.set(Constants.SESS_UKEYS + session.uinfo.username, result, 5*24*Configs.sessionLive);
        });
        cacheManager.set(session.id, session, Configs.sessionLive, callback);
    }

    /**
     * remove session from cache
     * @param {* the session is removed} session 
     */
    static remove_sess(session){
        cacheManager.delete(session.id);
        // manage list session key of user
        cacheManager.get(Constants.SESS_UKEYS + session.uinfo.username, function(err, result){
            if(result){
                //var index = result.indexOf(session.id);
                if (session.id in result) {
                    //result.splice(index, 1);
                    delete result[session.id];
                    if(Object.keys(result).length===0){
                        cacheManager.delete(Constants.SESS_UKEYS + session.uinfo.username);
                    }else{
                        cacheManager.set(Constants.SESS_UKEYS + session.uinfo.username, result, 5*24*Configs.sessionLive);
                    }
                }
            }
        });
    }

    static load_acl(user, db){
        return new Promise((resolve, reject) => {
            var action_ids = [];
            var action_names = [];
            var data = {}
            if(user.user_id != 1){ // the first user no need
                var user_action_model = new baseModel(db, 'acl_user_action_map', 'id');
                var cond = [];
                cond['user_id'] = user.user_id;
                var order = [];
                user_action_model.selectFields(['acl_action_id, acl_action.url']);
                user_action_model.join("acl_action", "acl_user_action_map.acl_action_id=acl_action.id","left")
                user_action_model.findAsync(cond, order).then(result =>{
                    for(var k in result){
                        action_ids.push(result[k].acl_action_id)
                        action_names.push(result[k].url)
                    }
                    if(user.acl_group_id && user.acl_group_id>0){
                        // load group permission
                        var user_group_action_model = new baseModel(db, 'acl_user_group_action_map', 'id');
                        cond = [];
                        cond['acl_user_group_id'] = user.acl_group_id;
                        order = [];
                        user_group_action_model.selectFields(['acl_action_id, acl_action.url']);
                        user_group_action_model.join("acl_action", "acl_user_group_action_map.acl_action_id=acl_action.id","left")
                        user_group_action_model.findAsync(cond, order).then(res =>{
                            for(let r of res){
                                action_ids.push(r.acl_action_id)
                                action_names.push(r.url)
                            }
                            data = {
                                user_id : user.user_id,
                                action_ids : action_ids,
                                action_names: action_names
                            }
                            resolve(data);
                        }).catch(err => {
                            reject(err);
                        })
                        // end load group permission
                    }else{
                        data = {
                            user_id : user.user_id,
                            action_ids : action_ids,
                            action_names: action_names
                        }
                        resolve(data);
                    }
                })
                .catch(err => {
                    reject(err);
                })
            }else{
                data = {
                    user_id : user.user_id,
                    action_ids : action_ids,
                    action_names: action_names
                }
                resolve(data);
            }
        })
    }

    static load_user_branch(user, db){
        return new Promise((resolve, reject) => {
            var ubranchM = new userBranchModel(db);
            var cond = [];
            cond['user_id'] = user.user_id;
            let data = [];
            ubranchM.findAsync(cond).then(result => {
                for(let r of result) {
                    data.push(r.branch_id);
                }
                resolve(data);
            })
            .catch(err => {
                logger.error(err, this.constructor.name+".find");
                reject(data);
            })
        })
    }
}