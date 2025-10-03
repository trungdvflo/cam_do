/**
 * nationality models.
 * create 2018/08/13
 * @author hanhdx
 * @version $Id$
 * @copyright 2018 MIT
 */ 
var baseModel = require('./baseModel');
var cacheManager = require('../lib/cacheManager')
const Utils = require('../lib/utils.js');
const logger = require('../lib/logger.js');
const AppDebug = require('../lib/appDebug.js');

module.exports = class nationalityModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "nationality", "nationality_id");
        this.key_all = 'nationality_all_record';
        this.key_get_id = 'nationality_id_record_';
        this.cache_time = 24*60*30;
    }
    /**
     * get all record
     * cache store
     * @author: trungdv
     */
    getAll(){
        var t = this;
        return new Promise((resolve, reject) => {
            cacheManager.get(t.key_all, function(err, result){
                if(err || !result || result.length<=0){
                    AppDebug.log('reload nationalityModel')
                    var cond = [], orderby = [];
                    t.findAsync(cond, orderby).then(res => {
                        // save to cache
                        cacheManager.set(t.key_all, res, t.cache_time);
                        resolve(res);
                    }).catch(err => {
                        reject(err);
                        logger.error(err, this.constructor.name+".getAll");
                    })
                }else{
                    AppDebug.log('from cache nationalityModel')
                    resolve(result);
                }
            })
        })
    }
    /**
     * cache store
     * @param {*} data 
     */
    insertAsync(data){
        cacheManager.delete(this.key_all);
        cacheManager.delete(this.key_get_id);
        return super.insertAsync(data);
    }
    /**
     * cache store
     * @param {} data 
     */
    updateAsync(data){
        cacheManager.delete(this.key_all);
        cacheManager.delete(this.key_get_id);
        return super.updateAsync(data);
    }
    /**
     * cache store
     * @param {*} key 
     */
    getByKeyAsync(key) {
        var t = this;
        return new Promise((resolve, reject) => {
            cacheManager.get(t.key_get_id, function(err, resKey){
                if(err || !resKey){
                    cacheManager.get(t.key_all, function(err, result){
                        if(err || !result || result.length<=0){
                            t.getAll().then(res => {
                                var index = res.findIndex(x => x.nationality_id == key);
                                if(index>=0){
                                    resolve(res[index])
                                    cacheManager.set(t.key_get_id, res[index], t.cache_time);
                                }else{
                                    reject(index);
                                }
                            })
                            .catch(err => {
                                logger.error(err, this.constructor.name+".get_by_config_key");
                                reject(err);
                            })
                        }else{
                            resolve(result[key]);
                        }
                    })        
                }else{
                    resolve(resKey);
                }
            })
        })
    }

    findDataAsync(data, orderby){
        if(Utils.isSet(data.name) || Utils.isSet(data.nationality_id)){
            //cond['vi_name LIKE'] = data.name+'%';
            //  cond['disable'] = 0;
            //var orderby = [];
            //return this.findAsync(cond, orderby)
            var t = this;
            return new Promise((resolve, reject) => {
                t.getAll().then(res =>{
                    if(res && res.length>0){
                        var r = res.filter(function(el){
                            if(data.name){
                                return el.vi_name.indexOf(data.name)>=0;
                            }else if(data.nationality_id){
                                return el.nationality_id==data.nationality_id;
                            }else{
                                return true;
                            }
                        });
                        resolve(r);
                    }else{
                        resolve(res)
                    }
                }).catch(err => {
                    reject(err);
                    logger.error(err, this.constructor.name+".findDataAsync");
                })
            })
        }else{
            return this.getAll();
        }
    }
    // query function here

    /**
     * get nationality info
     * @author: khanh
     */
    get_nationality(data) {
        return this.findDataAsync(data);
    }
}
