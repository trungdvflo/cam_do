/**
 * demo report controller.
 * create 2018/08/03
 * @author trungdv
 * @version $Id$
 * @copyright 2018 MIT
 */

const Constants = require('../../lib/constants.js');
const Utils = require('../../lib/utils.js');
const AppDebug = require('../../lib/appDebug.js');
const cacheManager = require('../../lib/cacheManager.js');
const base_ctrl = require('../base_ctrl.js');
var demoModel = require('../../models/demoModel.js');
const logger = require('../../lib/logger.js');

module.exports = class demo_report_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session) {
        super.beforeFilter(db, req, res, next, session);
    }
    index() {
        var data = [{	name:'toàn hoan', age:6, user_id:10}];
        var t=this;
        // TODO:
        setTimeout(function(){
            t.responeData(data, true, 200, "success");
        }, 10000)
    }
    
}