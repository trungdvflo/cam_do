/**
 * province models.
 * create 2018/08/13
 * @author hanhdx
 * @version $Id$
 * @copyright 2018 MIT
 */ 
var baseModel = require('./baseModel');
const Utils = require('../lib/utils.js');
const logger = require('../lib/logger.js');

module.exports = class provinceModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "province", "province_id");
    }

    // query function here

     /**
     * get province info
     * @author: khanh
     */
    async get_province(data) {
        var t = this;
        var conds = [];
        if (!Utils.isEmpty(data.province_id)) {
            conds['province_id'] = data.province_id;
        }
        t.selectFields("*");
        return t.findAsync(conds, []);
    }

    /**
     * get provinces by list name
     * @author: khanh
     */
    get_province_by_name(data) {
        let sql = "SELECT *";
        sql += " FROM province";
        sql += " WHERE 1 AND (";
        sql += 'vi_name LIKE ' + "'" + '%' + data[0] + '%' + "'";
        if(data.length > 1){
            for(let i = 1; i < data.length; i++){
                sql += ' OR vi_name LIKE ' + "'" + '%' + data[i] + '%' + "'";
            }
        }
        sql += ")";
        return this.queryAsync(sql);
    }
}
