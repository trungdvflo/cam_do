const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
const base_ctrl = require('../controllers/base_ctrl.js');
var baseModel = require('../models/baseModel.js');
var aclActionModel = require('../models/aclActionModel.js');
const logger = require('../lib/logger.js');
var manufacturerModel = require('../models/manufacturerModel.js');

module.exports = class manufacturer_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }
    index () { 
        var data = {}
        this.responeData(data, true, 200, "success");
    }

    find () {
        var t = this;
        var data = {};
        
        var Manufacturer = new manufacturerModel(t.db);
        var page = t.req.body.page || 1;
        var cond = [];
        if ( Utils.isSet(t.req.body.id) ) {
            cond['manufacturer.manufacturer_id'] = t.req.body.id;
        } else {
            if(Utils.isSet(t.req.body.name)){
                cond['manufacturer.name LIKE'] = '%' + t.req.body.name + '%';
            }
        }
        
        cond['manufacturer.disabled'] = Constants.NOT_DISABLED;
        var orderby = [];
        orderby['manufacturer.name'] = 'ASC';
        Manufacturer.join('country', 'manufacturer.country_id = country.country_id', 'left');
        Manufacturer.selectFields("manufacturer.*, country.vi_name as country_vi_name");
        Manufacturer.pagingAsync(cond, orderby, page, Constants.ROW_PER_PAGE).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            t.responeData(data, false, 301, "fail");
            logger.error(err, t.constructor.name+".find");
        })
    }

    findAll () {
        var t = this;
        var data = {};        
        var Manufacturer = new manufacturerModel(t.db);
        var cond = [];
        
        cond['manufacturer.disabled'] = Constants.NOT_DISABLED;
        var orderby = [];
        orderby['manufacturer.name'] = 'ASC';
        Manufacturer.selectFields("manufacturer.manufacturer_id, manufacturer.name");
        Manufacturer.findAsync(cond, orderby).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            t.responeData(data, false, 301, "fail");
            logger.error(err, t.constructor.name+".findAll");
        })
    }

    findAutocomplete () {
        var t = this;
        var data = {};
        
        var Manufacturer = new manufacturerModel(t.db);
        var cond = [];
        if(Utils.isSet(t.req.body.text)){
            cond['manufacturer.name LIKE'] = '%' + t.req.body.text + '%';
        }
        
        cond['manufacturer.disabled'] = Constants.NOT_DISABLED;
        var orderby = [];
        orderby['manufacturer.name'] = 'ASC';
        Manufacturer.join('country', 'manufacturer.country_id = country.country_id', 'left');
        Manufacturer.selectFields("manufacturer.*, country.vi_name as country_vi_name");
        Manufacturer.findAsync(cond, orderby, Constants.ROW_PER_PAGE).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            t.responeData(data, false, 301, "fail");
            logger.error(err, t.constructor.name+".findAutocomplete");
        })
    }

    save () {
        var t = this;
        var data = t.req.body;
        if(!t.hasPermission('category_manufacturer')){
            t.responeData(data, false, 1005, "Không có quyền truy cập.");
            logger.error('permission category_manufacturer', t.constructor.name+".save");
            return;
        }
        //check validate
        if ( !data.name ) {
            t.responeData(data, false, 300, "Vui lòng nhập tên.");
            logger.error('error data request', t.constructor.name+".save");
            return;
        }

        var Manufacturer = new manufacturerModel(t.db);
        if(!data.manufacturer_id){
            Manufacturer.insertAsync(data).then(result =>{
                t.responeData(result, true, 200, "Thêm mới thành công.");
            })
            .catch(err =>{
                t.responeData(data, false, 300, "Không thể thêm mới.");
                logger.error(err, t.constructor.name+".save");
            })
        }else{
            Manufacturer.updateAsync(data).then(result =>{
                t.responeData(result, true, 200, "Cập nhật thành công.");
            })
            .catch(err =>{
                t.responeData(data, false, 300, "Không thể cập nhật.");
                logger.error(err, t.constructor.name+".save");
            })
        }
    }

    delete () {
        var t = this;
        var data = t.req.body;
        if(!t.hasPermission('category_manufacturer')){
            t.responeData(data, false, 1005, "Không có quyền truy cập.");
            logger.error('permission category_manufacturer', t.constructor.name+".delete");
            return;
        }
        var Manufacturer = new manufacturerModel(t.db);
        Manufacturer.updateAsync(data).then(result =>{
            t.responeData(result, true, 200, "Xóa thành công.");
        })
        .catch(err =>{
            t.responeData(data, false, 300, "Không thể xóa.");
            logger.error(err, t.constructor.name+".delete");
        })
    }

    export_all () {
        var t = this;
        var data = {};
        if(!t.hasPermission('category_manufacturer')){
            t.responeData(data, false, 1005, "Không có quyền truy cập.");
            logger.error('permission category_manufacturer', t.constructor.name+".export_all");
            return;
        }
        var Manufacturer = new manufacturerModel(t.db);
        var cond = [];
        cond['manufacturer.disabled'] = Constants.NOT_DISABLED;        
        if ( !Utils.isEmpty(t.req.body.name) ) {
            cond['manufacturer.name LIKE'] = '%' + t.req.body.name + '%';
        }
        
        var orderby = [];
        orderby['manufacturer_id']  = 'DESC';
        Manufacturer.join('country', 'manufacturer.country_id = country.country_id', 'left');
        Manufacturer.selectFields("manufacturer.*, country.vi_name as country_vi_name");
        Manufacturer.findAsync(cond, orderby).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            t.responeData(data, false, 301, "fail");
            logger.error(err, t.constructor.name+".export_all");
        })
    }
}