/**
 * user controller.
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
const logger = require('../lib/logger.js');
var baseModel = require('../models/baseModel.js');
var alertModel = require('../models/alertModel.js');
 
module.exports = class comp_alert_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }
    index () { 
        var data = {
        };
        // TODO:
        this.responeData(data, true, 200, "success");
    }
    /**
     * save action
     * @author: trungdv
     */
    save () {
        var data = this.req.body;
        var t = this;
        if(!t.hasPermission('other_comp_alert')){
            logger.error('permission other_comp_alert', this.constructor.name+".save");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if(!data || !data.title){
            logger.error('error data request', this.constructor.name+".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        data.start_time = Utils.formatMySQL(data.start_time);
        data.end_time = Utils.formatMySQL(data.end_time);
        data.create_time = Utils.formatMySQL(data.create_time);
        AppDebug.log(data);
        var alertM = new alertModel(t.db);
        if(!data.id){
            alertM.insertAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể thêm thông báo");
            })
        }else{
            // if(data.password){
            //     data.password = Utils.hashPass(data.password);
            // }
            // delete data.password;  // not update pass1
            // delete data.username;  // not change username
            alertM.updateAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể sửa thông tin thông báo");
            })
        }
    }
    /**
     * find user action
     * common function
     * @author: trungdv
     */
    find () {
        var t = this;
        var data = {};
        var page = t.req.body.page || 1;
        var alertM = new alertModel(t.db);
        
        var cond = [];
        if(!Utils.isEmpty(t.req.body.department_id)){
            cond['company_alert.department_id'] = t.req.body.department_id;
        }
        if(!Utils.isEmpty(t.req.body.branch_id)){
            cond['company_alert.branch_id'] = t.req.body.branch_id;
        }
        if(!Utils.isEmpty(t.req.body.title)){
            cond['company_alert.title LIKE'] = t.req.body.title + '%';
        }
        if(Utils.isSet(t.req.body.enable)){
            cond['company_alert.enable'] = t.req.body.enable;
        }
        
        var orderby = [];
        orderby['start_time']  = 'DESC';
        orderby['id']  = 'DESC';
        alertM.join('branch as b', 'company_alert.branch_id = b.branch_id', 'left');
        var b_field = ',b.vi_name as b_vi_name';
        alertM.join('department as d', 'company_alert.department_id = d.department_id', 'left');
        var b_field = ',d.vi_name as d_vi_name, b.vi_name as b_vi_name';
        alertM.selectFields("company_alert.*" + b_field);
        alertM.pagingAsync(cond, orderby, page, Constants.ROW_PER_PAGE).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, this.constructor.name+".find");
            t.responeData(data, false, 301, "fail");
        })
    }

}