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
const logger = require('../lib/logger.js');
var districtModel = require('../models/districtModel.js');


module.exports = class district_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session) {
        super.beforeFilter(db, req, res, next, session);
    }
    index() {
        var data = {}
        this.responeData(data, true, 200, "success");
    }

    /**
     * find user action
     * @author: trungdv
     */
    get_district(id) {
        var t = this;
        var data = {};
        if (!id) {
            logger.error('miss id', this.constructor.name + ".district");
            t.responeData(data, false, 300, "Lỗi dữ liệu");
        }

        var districtM = new baseModel(t.db, 'district', 'district_id');
        var cond = [];
        cond['district_id'] = id;
        var orderby = [];
        logger.error(err, this.constructor.name + ".find");
        districtM.firstAsync(cond, orderby).then(result => {
                data = result;
                t.responeData(data, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".district");
                t.responeData(data, false, 301, "Không thể tìm");
            })
    }
    /**
     * find district action
     * @author: trungdv
     */
    find() {
        var t = this;
        var data = this.req.body;
        var cond = [];
        var orderby = [];
        var limit;
        orderby['vi_name'] = 'ASC';
        var districtM = new districtModel(t.db);
        if (Utils.isSet(data.name)) {
            cond['vi_name LIKE'] = t.req.body.name + '%';
        }
        if (!Utils.isEmpty(data.district_id)) {
            cond['district_id'] = data.district_id;
        }
        if (!Utils.isEmpty(data.province_id)) {
            cond['province_id'] = data.province_id;
        }
        if (!Utils.isEmpty(data.limit)) {
            limit = data.limit;
        }
        districtM.findAsync(cond, orderby, limit).then(result => {
                t.responeData(result, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".find");
                t.responeData(data, false, 301, "fail");
            })
    }
    getDistrictByProvinceId(provice_id) {
        var t = this;
        var cond = [];
        var orderby = [];
        var data = {};
        if (!provice_id) {
            return t.responeData(data, false, 301, "error data: province_id = " + provice_id);
        }

        var districtM = new districtModel(t.db);
        cond['province_id'] = provice_id;
        orderby['vi_name'] = 'ASC';

        districtM.findAsync(cond, orderby).then(result => {
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
     * @author: trungdv
     */
    save() {
        var data = this.req.body;
        var t = this;
        if (!t.hasPermission('category_district')) {
            logger.error('permission category_district', this.constructor.name + ".save");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if (!data || !data.vi_name) {
            logger.error('error data request', this.constructor.name + ".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        AppDebug.log(data);
        var districtM = new districtModel(t.db);
        if (!data.district_id) {
            districtM.insertAsync(data).then(result => {
                    t.responeData(result, true, 200, "success");
                })
                .catch(err => {
                    logger.error(err, this.constructor.name + ".save");
                    t.responeData(data, false, 300, "không thể insert");
                })
        } else {
            districtM.updateAsync(data).then(result => {
                    t.responeData(result, true, 200, "success");
                })
                .catch(err => {
                    logger.error(err, this.constructor.name + ".save");
                    t.responeData(data, false, 300, "không thể update");
                })
        }
    }
}