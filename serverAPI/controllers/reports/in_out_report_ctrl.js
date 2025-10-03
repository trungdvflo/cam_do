/**
 * user controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */

const Constants = require('../../lib/constants.js');
const Utils = require('../../lib/utils.js');
const AppDebug = require('../../lib/appDebug.js');
const cacheManager = require('../../lib/cacheManager.js');
const base_ctrl = require('../base_ctrl.js');
const logger = require('../../lib/logger.js');
var baseModel = require('../../models/baseModel.js');
var money_outModel = require('../../models/money_outModel.js');
var money_inModel = require('../../models/money_inModel.js');

module.exports = class in_out_report_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session) {
        super.beforeFilter(db, req, res, next, session);
    }
    index() {
        var data = {};
        // TODO:
        this.responeData(data, true, 200, "success");
    }
    

    /**
     * find find_out action
     * @author: trungdv
     */
    find_out() {
        var t = this;
        var data = t.req.body;
        if (!t.hasPermission('report_chi_phi')) {
            logger.error('permission report_chi_phi', t.req.path);
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var mo = new money_outModel(t.db);
        var cond = [];
        var orderby = [];
        orderby['id'] = 'ASC';

        if (data.branch_id>0) {
            cond['money_out.branch_id'] = data.branch_id;
        }
        if (data.report_date) {
            cond['money_out.ngay_cam'] = Utils.formatMySQL(data.report_date, true);
        }
        if (data.tu_ngay) {
            cond['money_out.ngay_cam >='] = Utils.formatMySQL(data.tu_ngay, true);
        }
        if (data.den_ngay) {
            cond['money_out.ngay_cam <='] = Utils.formatMySQL(data.den_ngay, true);
        }
        if (!Utils.isEmpty(data.trang_thai)) {
          cond['money_out.trang_thai'] = data.trang_thai;
        }
        if (data.chi_phi==1) {
          cond['OR'] = {
            'money_out.type': Constants.MONEY_OUT_TYPE.khac,
            'money_out.type ': Constants.MONEY_OUT_TYPE.tien_nha,
          };
        }
        if (!Utils.isEmpty(data.type)) {
          cond['money_out.type'] = data.type;
        }
        mo.findAsync(cond, orderby).then(result => {
            t.responeData(result, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, t.req.path);
            t.responeData(data, false, 301, "Lỗi tìm kiếm");
        })

    }

    /**
     * find find_out action
     * @author: trungdv
     */
    find_in() {
        var t = this;
        var data = t.req.body;
        if (!t.hasPermission(['report_chi_phi','report_rut_nhap_quy'])) {
            logger.error('permission report_chi_phi report_rut_nhap_quy', t.req.path);
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var mi = new money_inModel(t.db);
        var cond = [];
        var orderby = [];

        if (data.branch_id>0) {
            cond['money_in.branch_id'] = data.branch_id;
        }
        if (data.report_date) {
            cond['money_in.ngay_tra'] = Utils.formatMySQL(data.report_date, true);
        }
        if (data.tu_ngay) {
            cond['money_in.ngay_tra >='] = Utils.formatMySQL(data.tu_ngay, true);
        }
        if (data.den_ngay) {
            cond['money_in.ngay_tra <='] = Utils.formatMySQL(data.den_ngay, true);
        }
        cond['money_in.type'] = Constants.MONEY_IN_TYPE.von;
        mi.selectFields('money_in.*');
        mi.findAsync(cond, orderby).then(result => {
            t.responeData(result, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, t.req.path);
            t.responeData(data, false, 301, "Lỗi tìm kiếm");
        })

    }
}