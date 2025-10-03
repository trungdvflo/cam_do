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
var nationalityModel = require('../models/nationalityModel.js');
const logger = require('../lib/logger.js');

module.exports = class nationality_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }
    index () { 
        var data = {}
        this.responeData(data, true, 200, "success");
    }

    /**
     * find user action
     * @author: trungdv
     */
    get_nationality (id) {
        var t = this;
        var data = {};
        if(!id){
            logger.error('miss id', this.constructor.name+".nationality");
            t.responeData(data, false, 300, "Lỗi dữ liệu");
        }
        
        var nationalityM = new baseModel(t.db, 'nationality', 'nationality_id');
        var cond = {
            nationality_id: id
        }
        nationalityM.get_nationality(cond).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, this.constructor.name+".nationality");
            t.responeData(data, false, 301, "Không thể tìm");
        })
    }
    /**
     * find nationality action
     * @author: trungdv
     */
    find () {
        var t = this;
        var data = t.req.body;
        
        var nationalityM = new nationalityModel(t.db);
        var orderby = [];
        orderby['vi_name']  = 'ASC';
        nationalityM.findDataAsync(data, orderby).then(result => {
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
    save () {
        var data = this.req.body;
        var t = this;
        if(!t.hasPermission('category_hanhchinh')){
            logger.error('permission category_hanhchinh', this.constructor.name+".save");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if(!data || !data.vi_name){
            logger.error('error data request', this.constructor.name+".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        AppDebug.log(data);
        var nationalityM = new baseModel(t.db, 'nationality', 'nationality_id');
        if(!data.nationality_id){
            nationalityM.insertAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể insert");
            })
        }else{
            nationalityM.updateAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể update");
            })
        }
    }
}