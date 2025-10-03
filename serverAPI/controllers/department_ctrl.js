/**
 * department controller.
 * create 2018/03/06
 * @author trungdv
 * @version $Id$
 * @copyright 2018 MIT
 */

const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
const base_ctrl = require('../controllers/base_ctrl.js');
var departmentModel = require('../models/departmentModel.js');
const logger = require('../lib/logger.js');

module.exports = class department_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session) {
        super.beforeFilter(db, req, res, next, session);
    }
    index() {
        var data = {}
        this.responeData(data, true, 200, "success");
    }

    /**
     * find department action
     * @author: trungdv
     */
    find() {
        var t = this;
        var data = {};
        var departmentM = new departmentModel(t.db);
        var cond = [];

        if (!Utils.isEmpty(t.req.body.branch_id)) {
            cond['department.branch_id'] = t.req.body.branch_id;
        }
        if (!Utils.isEmpty(t.req.body.block_id)) {
            cond['department.block_id'] = t.req.body.block_id;
        }
        if (!Utils.isEmpty(t.req.body.lock_state)) {
            cond['department.deleted'] = Number.parseInt(t.req.body.lock_state);
        }
        if (t.req.body.deleted != undefined) {
            cond['deleted'] = t.req.body.deleted;
        }
        if (!Utils.isEmpty(t.req.body.intern)) {
            cond['intern'] = Constants.N_ONE;
        }

        var orderby = [];
        if (t.req.body.key) {
            if (t.req.body.key == 'get_all_dept' || t.req.body.key == 'search') {
                orderby['department_id'] = 'DESC';
                departmentM.join('branch as b', 'department.branch_id = b.branch_id', 'left');
                var b_field = ', b.vi_name as b_vi_name';
                departmentM.join('employee as e', 'department.head_id = e.person_id', 'left');
                var e_field = ', e.name as e_head_dept_name';
                departmentM.selectFields("department.*" + b_field + e_field);
            }
        } else {
            orderby['department_id'] = 'DESC';
            departmentM.selectFields("department_id, dept_code, vi_name, en_name, vi_description");
        }

        departmentM.findAsync(cond, orderby).then(result => {
                data = result;
                t.responeData(data, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".find");
                t.responeData(data, false, 301, "fail");
            })
    }
    
    /**
     * save action
     * @author: khanhvq
     */
    save() {
        var data = this.req.body;
        var t = this;
        if (!t.hasPermission('catetory_department')) {
            logger.error('permission catetory_department', this.constructor.name + ".save");
            return t.responeData(data, false, 1005, "Access denined!");
        }

        if (!data || data.intern == undefined || !data.branch_id || !data.vi_name) {
            logger.error('error data request', this.constructor.name + ".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        AppDebug.log(data);

        var departmentM = new departmentModel(t.db);
        data.en_name = Utils.convertVietnameseToViEn(data.vi_name);
        data.en_description = Utils.convertVietnameseToViEn(data.vi_description);
        if (!data.department_id) {
            departmentM.insertAsync(data).then(result => {
                    t.responeData(result, true, 200, "success");
                })
                .catch(err => {
                    logger.error(err, this.constructor.name + ".save");
                    t.responeData(data, false, 300, "không thể insert");
                })
        } else {
            departmentM.updateAsync(data).then(result => {
                    t.responeData(result, true, 200, "success");
                })
                .catch(err => {
                    logger.error(err, this.constructor.name + ".save");
                    t.responeData(data, false, 300, "không thể update");
                })
        }
    }

}