/**
 * career models.
 * create 2018/05/15
 * @author khanhvq
 * @version $Id$
 * @copyright 2018 MIT
 */ 

var baseModel = require('./baseModel');
const Utils = require('../lib/utils.js');
const logger = require('../lib/logger.js');

module.exports = class careerModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "career", "career_id");
    }

    // query function here

    /**
     * get all career info
     * @author: khanh
     */
    async get_careers(data) {
        var t = this;
        var conds = [];
        if (!Utils.isEmpty(data.career_id)) {
            conds['career_id'] = data.career_id;
        }
        t.selectFields("*");
        return t.findAsync(conds, []);
    }
}
