/**
 * ward models.
 * create 2018/06/19
 * @author khanh
 * @version $Id$
 * @copyright 2018 MIT
 */

var baseModel = require('./baseModel');
const Utils = require('../lib/utils.js');

module.exports = class wardModel extends baseModel {
    constructor(dbConn) {
        super(dbConn, "ward", "ward_id");
    }

    /**
     * get ward info
     * @author: khanh
     */
    find_ward_auto_code(data){
        var t = this;
        var conds = [];
        var limit;
        if(data.limit){
            limit = data.limit;
        }
        if(!Utils.isEmpty(data.auto_suggest_code)){
            conds['ward.auto_suggest_code LIKE'] = data.auto_suggest_code + '%';
        }
        t.join('district as ds', 'ward.district_id = ds.district_id', 'left');
        var ds_field = ',ds.district_id, ds.vi_name as ds_name';
        t.join('province as pr', 'ds.province_id = pr.province_id', 'left');
        var pr_field = ',pr.province_id, pr.vi_name as pr_name';
        t.selectFields('ward.ward_id, ward.vi_name as w_name, ward.auto_suggest_code' + ds_field + pr_field);
        return t.findAsync(conds, [], limit);
    }

    /**
     * get ward info
     * @author: khanh
     */
    async get_ward(data) {
        var t = this;
        var conds = [];
        if (!Utils.isEmpty(data.list_district_id)) {
            conds['district_id IN'] = data.list_district_id.toString();
        }
        t.selectFields("*");
        return t.findAsync(conds, []);
    }
}