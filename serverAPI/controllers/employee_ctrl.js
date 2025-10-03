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
var employeeModel = require('../models/employeeModel.js');
var userModel = require('../models/userModel.js');
var employeeHelper = require('../helpers/employee_helper.js');

module.exports = class employee_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session) {
        super.beforeFilter(db, req, res, next, session);
    }
    index() {
        var data = {};
        // TODO:
        this.responeData(data, true, 200, "success");
    }
    
    /**
     * save action
     * @author: trungdv
     */
    save() {
        var data = this.req.body;
        var t = this;
        if (!t.hasPermission('human_resource_manage')) {
            logger.error('permission human_resource_manage', this.constructor.name + ".save");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if (!data || !data.name) {
            logger.error('error data request', this.constructor.name + ".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var username = false;
        if (!Utils.isEmpty(data.username)) {
            username = data.username;
            delete data.username;
        }
        var em = new employeeModel(t.db);
        if (!data.person_id) {
            data.create_date = Utils.formatMySQL(new Date());
            em.insertAsync(data).then(async (result) => {
                await employeeHelper.updatePersonId4User(t.db, username, result.insertId);
                t.responeData(result, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".save");
                t.responeData(data, false, 300, "không thể insert");
            })
        } else {
            em.updateAsync(data).then(async (result) => {
                await employeeHelper.updatePersonId4User(t.db, username, data.person_id);
                t.responeData(result, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".save");
                t.responeData(data, false, 300, "không thể update");
            })
        }

    }

    /**
     * find user action
     * @author: trungdv
     */
    find() {
        var t = this;
        var data = t.req.body;
        var page = t.req.body.page || 1;
        var em = new employeeModel(t.db);
        var cond = [];
        var orderby = [];
        orderby['name'] = 'DESC';

        if (!Utils.isEmpty(data.type_id)) {
            cond['employee.employee_type_id'] = data.type_id;
        }
        if (Utils.isSet(data.enable)) {
            cond['employee.enable'] = data.enable;
        }


        if (data.page != undefined) {
            if (!Utils.isEmpty(data.department_id)) {
                cond['employee.department_id'] = data.department_id;
            }
            if (!Utils.isEmpty(data.name)) {
                cond['employee.name LIKE'] = '%' + data.name + '%';
            }

            em.join('user as u', 'employee.person_id = u.person_id', 'left');
            var u_field = ',u.user_id, u.username, u.nickname';
            em.join('department as d', 'employee.department_id = d.department_id', 'left');
            var d_field = ', d.vi_name as d_vi_name, d.en_name as d_en_name';
            em.join('employee_type as t', 'employee.employee_type_id = t.employee_type_id', 'left');
            var t_field = ', t.vi_name as t_vi_name, t.en_name as t_en_name';
            em.selectFields("employee.*" + u_field + d_field + t_field);

            em.pagingAsync(cond, orderby, page, Constants.ROW_PER_PAGE).then(result => {
                    data = result;
                    t.responeData(data, true, 200, "success");
                })
                .catch(err => {
                    logger.error(err, this.constructor.name + ".find");
                    t.responeData(data, false, 301, "Lỗi tìm kiếm");
                })
        } else {
            if (Utils.isSet(data.employee_type_id)) {
                cond['employee.employee_type_id'] = data.employee_type_id;
            }
            if (!Utils.isEmpty(data.name)) {
                cond['employee.name LIKE'] = '%' + data.name + '%';
            }
            if (!Utils.isEmpty(data.person_id)) {
                cond['person_id'] = data.person_id;
            }
            em.selectFields("person_id, name");
            em.findAsync(cond, orderby).then(result => {
                    data = result;
                    t.responeData(data, true, 200, "success");
                })
                .catch(err => {
                    logger.error(err, this.constructor.name + ".find");
                    t.responeData(data, false, 301, "Lỗi tìm kiếm");
                })
        }
    }

    export_all() {
        var t = this;
        var data = {};
        if (!t.hasPermission('human_resource_manage')) {
            logger.error('permission human_resource_manage', this.constructor.name + ".export_all");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var em = new employeeModel(t.db);
        var cond = [];
        if (!Utils.isEmpty(t.req.body.department_id)) {
            cond['employee.department_id'] = t.req.body.department_id;
        }
        if (!Utils.isEmpty(t.req.body.type_id)) {
            cond['employee.employee_type_id'] = t.req.body.type_id;
        }
        if (!Utils.isEmpty(t.req.body.name)) {
            cond['employee.name LIKE'] = '%' + t.req.body.name + '%';
        }
        if (Utils.isSet(t.req.body.enable)) {
            cond['employee.enable'] = t.req.body.enable;
        }
        var orderby = [];
        orderby['name'] = 'DESC';
        em.join('user as u', 'employee.person_id = u.person_id', 'left');
        var u_field = ',u.user_id, u.username, u.nickname';
        em.join('department as d', 'employee.department_id = d.department_id', 'left');
        var d_field = ', d.vi_name as d_vi_name, d.en_name as d_en_name';
        em.join('employee_type as t', 'employee.employee_type_id = t.employee_type_id', 'left');
        var t_field = ', t.vi_name as t_vi_name, t.en_name as t_en_name';
        em.selectFields("employee.*" + u_field + d_field + t_field);
        em.findAsync(cond, orderby).then(result => {
                data = result;
                t.responeData(data, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".export_all");
                t.responeData(data, false, 301, "fail");
            })
    }

    /**
     * load types of employee action
     * @author: trungdv
     */
    types() {
        var t = this;
        var data = {};
        var types = new baseModel(t.db, 'employee_type', 'employee_type_id');
        var cond = [];

        var orderby = [];
        types.findAsync(cond, orderby).then(result => {
                data = result;
                t.responeData(data, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".types");
                t.responeData(data, false, 301, "Lỗi tìm kiếm");
            })
    }
    /**
     * load diplomas of employee action
     * @author: trungdv
     */
    diplomas() {
        var t = this;
        var data = {};
        var diplomas = new baseModel(t.db, 'diploma', 'diploma_id');
        var cond = [];

        var orderby = [];
        diplomas.findAsync(cond, orderby).then(result => {
                data = result;
                t.responeData(data, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".diplomas");
                t.responeData(data, false, 301, "Lỗi tìm kiếm");
            })
    }

    /**
     * find limit employee action
     * @author: khanh
     */
    find_auto_employee(){
        try {
            var t = this;
            var data = t.req.body;
            if(!data || data.type_id == undefined || !data.name){
                logger.error('error data request', this.constructor.name + ".find_auto_employee, data:" + JSON.stringify(data));
                return t.responeData([], false, 300, "Lỗi dữ liệu gởi");
            }
            var employeeM = new employeeModel(t.db);
            employeeM.get_auto_employee(data).then(result => {
                console.log("result=",result);
                t.responeData(result, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name+".find_auto_employee , data:" + JSON.stringify(data));
                t.responeData(data, false, 301, "fail");
            })
        } catch (err) {
            logger.error(err, this.constructor.name + ".find_auto_employee, data:" + JSON.stringify(data));
            return t.responeData([], false, 301, "fail");
        }
    }
}