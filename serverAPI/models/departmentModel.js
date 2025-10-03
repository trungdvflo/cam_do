/**
 * department models.
 * create 2017/02/23
 * @author khanhvq
 * @version $Id$
 * @copyright 2017 MIT
 */

var baseModel = require('./baseModel');
const logger = require('../lib/logger.js');
const Utils = require('../lib/utils.js');

const OUT_PATIENT_DEPT = 0;
const IN_PATIENT_DEPT = 1;
const ADMINISTRATIVE_DEPT = 2;
const CHI_DINH_DEPT = 3;
const UN_DELETED = 0;
const DELETED = 1;
const ASC = 'ASC';
const DESC = 'DESC';
module.exports = class departmentModel extends baseModel {
    constructor(dbConn) {
        super(dbConn, "department", "department_id");
    }

    // query function here

    /**
     * get name department
     * @author: khanh
     */
    async get_dept(data) {
        var t = this;
        var conds = [];
        var orderby = [];
        if (!Utils.isEmpty(data.department_id)) {
            conds['department_id'] = data.department_id;
        }
        t.selectFields("vi_name");
        return t.findAsync(conds, orderby);
    }
    /**
     * @description get list department by param 
     * @author hanhdx
     */
    get_department(params, deleted) {
        var t = this;
        var conds = [];
        var orderby = [];
        return new Promise((resolve, reject) => {
            try {
                conds['deleted'] = deleted;
                if (!Utils.isEmpty(params.department_id)) {
                    conds['department_id'] = params.department_id;
                }
                if (!Utils.isEmpty(params.intern)) {
                    conds['intern'] = params.intern;
                }
                if (!Utils.isEmpty(params.vi_name)) {
                    conds['vi_name'] = params.vi_name;
                }
                if (!Utils.isEmpty(params.department_id)) {
                    conds['intern'] = params.intern;
                }
                if (!Utils.isEmpty(params.branch_id)) {
                    conds['branch_id'] = params.branch_id;
                }
                if (!Utils.isEmpty(params.head_id)) {
                    conds['head_id'] = params.head_id;
                }
                if (!Utils.isEmpty(params.block_id)) {
                    conds['block_id'] = params.block_id;
                }
                orderby['vi_name'] = 'ASC';
                t.findAsync(conds, orderby).then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        logger.error(err, "func: get_department");
                        reject(err);
                    })
            } catch (err) {
                logger.error(err, "func: get_department");
                reject(err);
            }
        })
    }
    /**
     * List department intern
     * Danh sách khoa nội trú
     * @author hanhdx;
     */
    get_in_patient_department() {
        var t = this;
        var conds = [];
        var orderBy = [];
        return new Promise((resolve, reject) => {
            try {
                conds['intern'] = IN_PATIENT_DEPT;
                conds['deleted'] = UN_DELETED;
                orderBy['name'] = ASC;
                t.findAsync(conds, orderby).then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        logger.error(err, "func: get_in_patient_department");
                        reject(err);
                    })
            } catch (err) {
                logger.error(err, "func: get_in_patient_department");
                reject(err);
            }
        });
    }
    /**
     * List department outtern
     * Danh sách khoa ngoại trú
     * @author hanhdx;
     */
    get_out_patient_department() {
        var t = this;
        var conds = [];
        var orderBy = [];
        return new Promise((resolve, reject) => {
            try {
                conds['intern'] = OUT_PATIENT_DEPT;
                conds['deleted'] = UN_DELETED;
                orderBy['name'] = ASC;
                t.findAsync(conds, orderby).then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        logger.error(err, "func: get_out_patient_department");
                        reject(err);
                    })
            } catch (err) {
                logger.error(err, "func: get_out_patient_department");
                reject(err);
            }
        });
    }
    /**
     * Danh sách khoa chỉ định
     * @author hanhdx;
     */
    get_chidinh_department() {
        var t = this;
        var conds = [];
        var orderBy = [];
        return new Promise((resolve, reject) => {
            try {
                conds['intern'] = CHI_DINH_DEPT;
                conds['deleted'] = UN_DELETED;
                orderBy['name'] = ASC;
                t.findAsync(conds, orderby).then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        logger.error(err, "func: get_chidinh_department");
                        reject(err);
                    })
            } catch (err) {
                logger.error(err, "func: get_chidinh_department");
                reject(err);
            }
        });
    }
    /**
     * Danh sách phòng ban
     * @author hanhdx;
     */
    get_administrative_department() {
        var t = this;
        var conds = [];
        var orderBy = [];
        return new Promise((resolve, reject) => {
            try {
                conds['intern'] = ADMINISTRATIVE_DEPT;
                conds['deleted'] = UN_DELETED;
                orderBy['name'] = ASC;
                t.findAsync(conds, orderby).then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        logger.error(err, "func: get_administrative_department");
                        reject(err);
                    })
            } catch (err) {
                logger.error(err, "func: get_administrative_department");
                reject(err);
            }
        });
    }

    /**
     * get list department that doctor working
     * @author: khanh
     */
    async get_dept_working(data) {
        var t = this;
        var conds = [];
        var orderby = [];
        if(data.user_id == 1){ // admin
            conds['department.deleted'] = 0;
            conds['department.intern'] = 1;
            conds['r.deleted'] = 0;
            conds['r.enum_room_type'] = 1;
            conds['b.deleted'] = 0;
            orderby['department.vi_name'] = 'ASC';
            t.join('room as r', 'department.department_id = r.department_id', 'left');
            t.join('bed as b', 'r.room_id = b.room_id', 'left');
            t.selectFields("DISTINCT department.department_id, department.vi_name");
        }else{ // doctor
            conds['edm.employee_id'] = data.person_id;
            t.join('employee_department_map as edm', 'department.department_id = edm.department_id', 'left');
            t.selectFields("department.department_id, department.vi_name");
        }
        return t.findAsync(conds, orderby);
    }
}