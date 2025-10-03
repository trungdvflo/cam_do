/**
 * user_group controller.
 * create 2017/12/25
 * @author hanhdx
 * @version $Id$
 * @copyright 2017 MIT
 */ 

const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
const base_ctrl = require('../controllers/base_ctrl.js');
var baseModel = require('../models/baseModel.js');
var aclActionModel = require('../models/aclActionModel.js');
const logger = require('../lib/logger.js');
var wardModel = require('../models/wardModel.js');

module.exports = class ward_ctrl extends base_ctrl {
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
    get_ward (id) {
        var t = this;
        var data = {};
        if(!id){
            logger.error('miss id', this.constructor.name+".ward");
            t.responeData(data, false, 300, "Lỗi dữ liệu");
        }
        
        var wardM = new baseModel(t.db, 'ward', 'ward_id');
        var cond = [];
        cond['ward_id'] = id;
        var orderby = [];
        logger.error(err, this.constructor.name+".find");
        wardM.firstAsync(cond, orderby).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, this.constructor.name+".ward");
            t.responeData(data, false, 301, "Không thể tìm");
        })
    }
    /**
     * find ward action
     * @author: trungdv
     */
    find () {
        var t = this;
        var data = {};
        let limit;
        
        var wardM = new baseModel(t.db, 'ward', 'ward_id');
        var cond = [];
        if(Utils.isSet(t.req.body.name)){
            cond['vi_name LIKE'] = t.req.body.name+'%';
        }
      //  cond['disable'] = 0;
        var orderby = [];
        orderby['vi_name']  = 'ASC';

        if(!Utils.isEmpty(t.req.body.vi_name)){
            cond['vi_name LIKE'] = '%' + t.req.body.vi_name + '%';
        }

        if(t.req.body.district_id){
            cond['district_id'] = t.req.body.district_id;
        }
        if(data.limit){
            limit = data.limit;
        }

        wardM.findAsync(cond, orderby, limit).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, this.constructor.name+".find");
            t.responeData(data, false, 301, "fail");
        })
    }

    find_auto_suggest_code () {
        var t = this;
        var data = t.req.body;
        
        var wardM = new wardModel(t.db);
        wardM.find_ward_auto_code(data).then(res =>{
            t.responeData(res, true, 200, "success");
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".find");
            t.responeData([], false, 300, "fail");
        })
    }

    getWardByDistrictId(district_id){
        var t = this;
        var data = {};
        
        var wardM = new baseModel(t.db, 'ward', 'ward_id');
        var cond = [];
        cond['district_id'] = district_id;
        var orderby = [];
        orderby['vi_name']  = 'ASC';AppDebug.log("wardM "+ wardM);

        wardM.findAsync(cond, orderby).then(result => {
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
        if(!t.hasPermission('category_ward')){
            logger.error('permission category_ward', this.constructor.name+".save");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if(!data || !data.vi_name){
            logger.error('error data request', this.constructor.name+".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        AppDebug.log(data);
        var wardM = new baseModel(t.db, 'ward', 'ward_id');
        if(!data.ward_id){
            wardM.insertAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể insert");
            })
        }else{
            wardM.updateAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể update");
            })
        }
    }
}