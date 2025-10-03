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
var salaryModel = require('../models/salaryModel.js');

module.exports = class salary_ctrl extends base_ctrl {
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
        if (!t.hasPermission(['thulao_manager'])) {
            logger.error('permission  cam_do_edit', t.req.path);
            return t.responeData(data, false, 1005, "Access denined!");
        }
        data.branch_id = t.session.uinfo.branch_id || data.branch_id;
        if (!data || !data.balance || !data.balance_date || !data.branch_id) {
            logger.error('error data request', t.req.path);
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        if(data.balance <= 0){
          logger.error('error data request', t.req.path);
          return t.responeData(data, false, 303, "Lỗi nhập tiền");
        }
        if (!Utils.isEmpty(data.username)) {
        }
        var salaryM = new salaryModel(t.db);
        data.created_date = new Date();
        data.balance_date = Utils.formatMySQL(data.balance_date);
        if(!data.id){
          data.creator = t.session.uinfo.username;
          salaryM.insertAsync(data).then(result => {
              t.responeData(result, true, 200, "success");
          })
          .catch(err => {
              logger.error(err, t.req.path);
              t.responeData(data, false, 301, "không thể insert");
          })
        }else{
          let conds = [];
          conds['creator'] = t.session.uinfo.username;
          conds['branch_id'] = data.branch_id;
          conds['status'] = 0;
          salaryM.updateAsync(data, conds).then(result => {
              t.responeData(result, true, 200, "success");
          })
          .catch(err => {
              logger.error(err, t.req.path);
              t.responeData(data, false, 301, "không thể cập nhật");
          })
        }
    }

    /**
     * delete action
     * @author: trungdv
     */
    delete(id) {
        var data = this.req.body;
        var t = this;
        if (!t.hasPermission(['thulao_manager'])) {
            logger.error('permission  thulao_manager', t.req.path);
            return t.responeData(data, false, 1005, "Access denined!");
        }
        data.branch_id = t.session.uinfo.branch_id || data.branch_id;
        if (!id) {
            logger.error('error data request', t.req.path);
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var salaryM = new salaryModel(t.db);
        let conds = [];
        conds['creator'] = t.session.uinfo.username;
        conds['branch_id'] = data.branch_id;
        conds['status'] = Constants.SALARY_STATUS.NOT_PAY_YES;
        salaryM.deleteAsync(id, conds).then(result => {
            t.responeData(result, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, t.req.path);
            t.responeData(data, false, 301, "không thể xóa");
        })
    }

    /**
     * pay action
     * @author: trungdv
     */
    pay(id) {
        var data = this.req.body;
        var t = this;
        if (!t.hasPermission(['thulao_manager'])) {
            logger.error('permission  thulao_manager', t.req.path);
            return t.responeData(data, false, 1005, "Access denined!");
        }
        data.branch_id = t.session.uinfo.branch_id || data.branch_id;
        if (!id) {
            logger.error('error data request', t.req.path);
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var salaryM = new salaryModel(t.db);
        let conds = [];
        conds['creator'] = t.session.uinfo.username;
        conds['branch_id'] = data.branch_id;
        conds['status'] = Constants.SALARY_STATUS.NOT_PAY_YES;
        let dataUp = {
          id,
          status: Constants.SALARY_STATUS.PAYED
        }
        salaryM.updateAsync(dataUp, conds).then(result => {
            t.responeData(result, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, t.req.path);
            t.responeData(data, false, 301, "không thể cập nhật chi");
        })
    }

    /**
     * find action
     * @author: trungdv
     */
    find() {
        var t = this;
        var data = t.req.body;
        if (!t.hasPermission(['quan_ly_quy_view','cam_do_view'])) {
            logger.error('permission quan_ly_quy_view cam_do_view', t.req.path);
            return t.responeData(data, false, 1005, "Access denined!");
        }
        data.branch_id = t.session.uinfo.branch_id || data.branch_id;
        var salaryM = new salaryModel(t.db);
        var cond = [];
        var orderby = [];

        if (data.id>0) {
            cond['salary.id'] = data.id;
        }
        if (data.branch_id>0) {
            cond['salary.branch_id'] = data.branch_id;
        }
        if (data.tu_ngay) {
            cond['salary.balance_date >='] = Utils.formatMySQL(data.tu_ngay, true);
        }
        if (data.den_ngay) {
            cond['salary.balance_date <='] = Utils.formatMySQL(data.den_ngay, true);
        }
        if (!Utils.isEmpty(data.status)) {
          cond['salary.status'] = data.status;
        }
        salaryM.findAsync(cond, orderby).then(result => {
            t.responeData(result, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, t.req.path);
            t.responeData(data, false, 301, "Lỗi tìm kiếm");
        })

    }
}