const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
const base_ctrl = require('../controllers/base_ctrl.js');
var aclActionModel = require('../models/aclActionModel.js');
const logger = require('../lib/logger.js');
var baseModel = require('../models/baseModel.js');
var countryModel = require('../models/countryModel.js');

module.exports = class country_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }
    index () { 
        var data = {
        };
        // TODO:
        logger.info('', this.constructor.name+".index");
        this.responeData(data, true, 200, "success");
    }
    
    find () {
        var t = this;
        var data = {};
        var Country = new countryModel(t.db);
        var cond = [];
        cond['disable'] = Constants.NOT_DISABLED;
        var orderby = [];
        orderby['vi_name']  = 'ASC';
        Country.selectFields("country.*");
        Country.findAsync(cond, orderby).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            t.responeData(data, false, 301, "fail");
            logger.error(err, t.constructor.name+".find");
        })
    }
}