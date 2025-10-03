/**
 * user_group controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
const base_ctrl = require('../controllers/base_ctrl.js');
var baseModel = require('../models/baseModel.js');
var configurationModel = require('../models/configurationModel.js');
const logger = require('../lib/logger.js');

module.exports = class config_system_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }
    index () { 
        var data = {}
        this.responeData(data, true, 200, "success");
    }

    load_check_bhyt(){
        var data = {}
        var t = this;
        cacheManager.get('allow_no_check_bhyt', function(err, result){
            if(result){
                t.responeData(result, true, 200, "success");
            }else{
                t.responeData(data, false, 300, "error load allow_no_check_bhyt");
            }
        })
    }
    save_conf_check_bhyt(){
        var data = this.req.body;
        var t = this;
        if(!t.hasPermission('system_configuration')){
            logger.error('permission system_configuration', this.constructor.name+".save_conf_check_bhyt");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if(!data || !data.allow_no_check_bhyt){
            logger.error('error data request', this.constructor.name+".save_conf_check_bhyt");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }

        cacheManager.set('allow_no_check_bhyt', data.allow_no_check_bhyt, 60*1000, function(err, result){
            if(result){
                t.responeData(result, true, 200, "success");
            }else{
                t.responeData(data, false, 300, "error save allow_no_check_bhyt");
            }
        })
    }

    /**
     * find user action
     * @author: trungdv
     */
    load_configs () {
        var t = this;
        var data = {};

        var confM = new configurationModel(t.db);
        confM.getAll().then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, this.constructor.name+".find");
            t.responeData(data, false, 301, "fail");
        })
    }
    /**
     * save action
     * @author: trungdv
     */
    save_configs () {
        var data = this.req.body;
        var t = this;
        if(!t.hasPermission('system_configuration')){
            logger.error('permission system_configuration', this.constructor.name+".save_configs");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if(!data || !data.vi_name || !data.value){
            logger.error('error data request', this.constructor.name+".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        //AppDebug.log(data);
        var confM = new configurationModel(t.db);
        if(!data.configuration_id){
            confM.insertAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể insert");
            })
        }else{
            confM.updateAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể update");
            })
        }
    }

}