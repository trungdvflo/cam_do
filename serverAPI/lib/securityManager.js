/**
 * Configs.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
const Configs = require('../config/configs.js');
const Utils = require('./utils.js');
// not cache here
module.exports = class securityManager {
    static validateAppKey(aKey, ip, callback){
        var err = false;
        var result = '';
        var keys = aKey.split('_');
        if(!keys && keys.length<3){ 
            err = true;
        }else{
            if(Utils.checkSum(keys[0], keys[1])){
                err = false;
            }else{
                err = true;
            }
            if(!err){
                // check exist
                const appId = keys[2]
                var key_conf =  Configs.apps_key[appId];
                if(aKey != key_conf) err = true;
                err = (err)? err : securityManager.validateIp(appId, ip);
            }
        }
        /**
         * check tu bien global
         * if ko co thi doc tu file
         */
        callback(err, result);
    }

    static validateIp(appId, ip){
        var err = false;
        if(Configs.app_ips_whitelist && Configs.app_ips_whitelist[appId]){
            const appIps = Configs.app_ips_whitelist[appId];
            if(appIps.length>0 && appIps.indexOf(ip)<0){
                err = true;
            }
        }
        return err;
    }

    static validateUserKey(uKey, callback){
        var err = false;
        var result = '';
        var keys = uKey.split('_');
        if(!keys && keys.length<3){ 
            err = true;
        }else{
            if(Utils.checkSum(keys[0], keys[2])){
                err = false;
            }else{
                err = true;
            }
        }

        callback(err, result);
    }
}