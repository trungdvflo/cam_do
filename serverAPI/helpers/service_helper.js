/**
 * user controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
const Utils = require('../lib/utils.js');

module.exports = class service_helper {

    /**
     * 
     * @param {* code of service is need check} code 
     * @param {* id of service (option)} id 
     * @param {* serviceModel} serviceM 
     */
    isExistServiceCode(code, id, serviceM){
        var conds = []
        conds['code'] = code;
        if(!Utils.isEmpty(id)){
            conds['service_id <>'] = id;
        }
        return new Promise((resolve, reject) => {
            serviceM.firstAsync(conds).then(res =>{
                if(res && res.code){
                    resolve(res);
                }else{
                    reject(res);
                }
            }).catch(err =>{
                reject(err)
            })
        })
    }
}