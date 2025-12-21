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

module.exports = class active_report_ctrl extends base_ctrl {
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
    miss_report() {
        var t = this;
        var data = t.req.body;
        if (!t.hasPermission('report_miss')) {
            logger.error('permission report_miss', t.req.path);
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
        cond['money_out.is_reported'] = 0;
 
        mo.findAsync(cond, orderby).then(result => {
            var mi = new money_inModel(t.db);
            var cond2 = [];
            if (data.branch_id>0) {
                cond2['money_in.branch_id'] = data.branch_id;
            }
            if (data.report_date) {
                cond2['money_in.ngay_tra'] = Utils.formatMySQL(data.report_date, true);
            }
            if (data.tu_ngay) {
                cond2['money_in.ngay_tra >='] = Utils.formatMySQL(data.tu_ngay, true);
            }
            if (data.den_ngay) {
                cond2['money_in.ngay_tra <='] = Utils.formatMySQL(data.den_ngay, true);
            }
            cond2['money_in.is_reported'] = 0;
    
            mi.findAsync(cond2, orderby).then(result2 => {
                t.responeData([...result, ...result2], true, 200, "success");
            })
            .catch(err => {
                logger.error(err, t.req.path);
                t.responeData(data, false, 302, "Lỗi tìm kiếm");
            })
        })
        .catch(err => {
            logger.error(err, t.req.path);
            t.responeData(data, false, 301, "Lỗi tìm kiếm");
        })
    }
}