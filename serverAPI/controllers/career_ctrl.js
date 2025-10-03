/**
 * career controller.
 * create 2018/05/16
 * update 2018/08/28
 * @author hanhdx
 * @version $Id$
 * @copyright 2017 MIT
 */

const base_ctrl = require('../controllers/base_ctrl.js');
const logger = require('../lib/logger.js');
var careerModel = require('../models/careerModel.js');

module.exports = class career_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session) {
        super.beforeFilter(db, req, res, next, session);
    }
    index() {
        var data = {}
        this.responeData(data, true, 200, "success");
    }

    get_career(id) {
        var t = this;
        var data = {};
        if (!id) {
            logger.error('miss id', this.constructor.name + ".career");
            t.responeData(data, false, 300, "Lỗi dữ liệu");
        }

        var careerM = new careerModel(t.db);
        var cond = [];
        cond['career_id'] = id;
        var orderby = [];
        logger.error(err, this.constructor.name + ".find");
        patient_careerM.firstAsync(cond, orderby).then(result => {
                data = result;
                t.responeData(data, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".career");
                t.responeData(data, false, 301, "Không thể tìm");
            })
    }

    find() {
        var t = this;
        var data = {};

        var conds = [];
        // if(Utils.isSet(t.req.body.vi_name)){
        //     cond['vi_name LIKE'] = '%'+t.req.body.vi_name+'%';
        // }
        var orderby = [];
        //orderby['branch_id']  = 'DESC';
        var careerM = new careerModel(t.db);
        careerM.findAsync(conds, orderby).then(result => {
                data = result;
                t.responeData(data, true, 200, "success");
            })
            .catch(err => {
                logger.error(err, this.constructor.name + ".find");
                t.responeData(data, false, 301, "fail");
            })
    }
    save() {
        var data = this.req.body;
        var t = this;
        if (!t.hasPermission('category_hanhchinh')) {
            logger.error('permission category_hanhchinh', this.constructor.name + ".save");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if (!data || !data.vi_name || !data.code) {
            logger.error('error data request', this.constructor.name + ".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var careerM = new careerModel(t.db);
        if (!data.career_id) {
            // check duplicate
            careerM.insertAsync(data).then(result => {
                    t.responeData(result, true, 200, "success");
                })
                .catch(err => {
                    logger.error(err, this.constructor.name + ".save");
                    t.responeData(data, false, 300, "không thể insert");
                })
        } else {
            careerM.updateAsync(data).then(result => {
                    t.responeData(data, true, 200, "success");
                })
                .catch(err => {
                    logger.error(err, this.constructor.name + ".save");
                    t.responeData(data, false, 300, "không thể update");
                })
        }
    }
}