/**
 * Configs.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
const Configs = require('../config/configs.js');
var baseModel = require('../models/baseModel.js');
const Utils = require('./utils.js');
const AppDebug = require('./appDebug.js');
const logger = require('./logger.js');
global.cacheReleaseTime = new Date().getTime();

module.exports = class cacheManager {
    static init(dbConn){
        this.dbConn = dbConn;
    }
    static releaseCache(){
        if(Configs.cache_type == 'db'){
            var sql = "DELETE FROM `cache` WHERE stime < '"+Utils.formatMySQL(new Date())+"'";
            this.dbConn.query(sql, function(){});
        }
    }
    static set(key, value, t, callback){
        if(Configs.cache_type == 'db'){
            try{
                var cacheTb = new baseModel(this.dbConn, "cache");
                var obj = {
                    id  : key,
                    cvalue: JSON.stringify(value),
                    ctime: Utils.addMinutes(new Date(), t/60)
                }
                cacheTb.delete(key, function(err,result){
                    if(typeof callback === "function"){
                        cacheTb.insert(obj, callback);
                    }else{
                        cacheTb.insert(obj, function(t){});
                    }
                })
            }catch(ex){
                AppDebug.log(ex);
                logger.error(ex);
                
            }
        }else if(memcache){
            if(typeof callback === "function"){
                memcache.set(key, value, t, callback);
            }else{
                memcache.set(key, value, t, function(){});
            }
        }
    }
    static replace(key, value, t, callback){
        if(Configs.cache_type == 'db'){
            try{
                var cacheTb = new baseModel(this.dbConn, "cache");
                var obj = {
                    id  : key,
                    cvalue: JSON.stringify(value),
                    ctime: Utils.addMinutes(new Date(), t/60)
                }
                if(typeof callback === "function"){
                    cacheTb.update(obj, [], callback);
                }else{
                    cacheTb.update(obj, [], function(t){});
                }
            }catch(ex){
                AppDebug.log(ex);
                logger.error(ex);
                
            }
        }else if(memcache){
            if(typeof callback === "function"){
                memcache.replace(key, value, t, callback);
            }else{
                memcache.replace(key, value, t, function(){});
            }
        }
    }
    static get(key, callback){
        if(Configs.cache_type == 'db'){
            var cacheTb = new baseModel(this.dbConn, "cache");
            cacheTb.getByKey(key,function(err, result){
                if(err) AppDebug.log(err);
                if(!err && Utils.isSet(result)){
                    if(result.ctime<new Date()){
                        callback(true, null);
                        cacheTb.delete(key, function(){});
                    }else{
                        callback(err, JSON.parse(result.cvalue));
                    }
                }else{
                    callback(err, null);
                }
            });
            var now = new Date().getTime();
            if(now - cacheReleaseTime > 1000*Configs.sessionLive){
                AppDebug.log('cache is released..')
                cacheReleaseTime = now;
                this.releaseCache();
            }
        }else if(memcache){
            memcache.get(key, callback);
        }  
    }
    static delete(key, callback){
        if(Configs.cache_type == 'db'){
            var cacheTb = new baseModel(this.dbConn, "cache");
            if(typeof callback === "function"){
                cacheTb.delete(key,callback);
            }else{
                cacheTb.delete(key,function(t){});
            }
        }else if(memcache){
            if(typeof callback === "function"){
                memcache.del(key, callback);
            }else{
                memcache.del(key, function(t){});
            }
        }           
    }
}