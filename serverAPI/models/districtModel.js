/**
 * district models.
 * create 2018/08/14
 * @author hanhdx
 * @version $Id$
 * @copyright 2018 MIT
 */ 

var baseModel = require('./baseModel');
const Utils = require('../lib/utils.js');
const logger = require('../lib/logger.js');

module.exports = class districtModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "district", "district_id");
    }

    // query function here

    /**
     * get district info
     * @author: khanh
     */
    async get_district(data) {
        var t = this;
        var conds = [];
        if (!Utils.isEmpty(data.district_id)) {
            conds['district_id'] = data.district_id;
        }
        if (!Utils.isEmpty(data.list_province_code)) {
            conds['province_id IN'] = data.list_province_code.toString();
        }
        if (!Utils.isEmpty(data.province_id)) {
            conds['province_id'] = data.province_id;
        }
        t.selectFields("*");
        return t.findAsync(conds, []);
    }
    
}
