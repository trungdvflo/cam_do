/**
 * configurationModel models.
 * create 2018/12/24
 * @author hanhdx
 * @version $Id$
 * @copyright 2017 MIT
 */

var baseModel = require('./baseModel');
var cacheManager = require('../lib/cacheManager')

module.exports = class configurationModel extends baseModel {
    constructor(dbConn) {
        super(dbConn, "configuration", "configuration_id");
        this.key_all = 'configuration_all_record';
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
                    var cond = [], orderby = [];
                    orderby['type']  = 'DESC';
                    t.findAsync(cond, orderby).then(res => {
                        // convert to array key
                        var resCKey = {};
                        for(let r of res){
                            resCKey[r.config_key] = r;
                        }
                        // save to cache
                        cacheManager.set(t.key_all, resCKey, t.cache_time);
                        resolve(resCKey);
                    }).catch(err => {
                        reject(err);
                        logger.error(err, this.constructor.name+".getAll");
                    })
                }else{
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
        return super.insertAsync(data);
    }
    /**
     * cache store
     * @param {} data 
     */
    updateAsync(data){
        cacheManager.delete(this.key_all);
        return super.updateAsync(data);
    }
    /**
     * load configs system by config_key
     * cache store
     * @author: hanhdx
     */
    get_by_config_key(k) {
        var t = this;
        return new Promise((resolve, reject) => {
            cacheManager.get(t.key_all, function(err, result){
                if(err || !result || result.length<=0){
                    t.getAll().then(res => {
                        resolve(res[k])
                    })
                    .catch(err => {
                        logger.error(err, this.constructor.name+".get_by_config_key");
                        reject(err);
                    })
                }else{
                    resolve(result[k]);
                }
            })
        })
    }
};