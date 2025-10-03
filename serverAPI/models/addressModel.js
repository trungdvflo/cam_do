/**
 * address models.
 * create 2018/05/19
 * @author khanhvq
 * @version $Id$
 * @copyright 2018 MIT
 */ 

var baseModel = require('./baseModel');
const Utils = require('../lib/utils.js');
const logger = require('../lib/logger.js');

module.exports = class addressModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "address", "address_id");
    }

    // query function here

    /**
     * get address info
     * @author: khanh
     */
    async get_address(data) {
        var t = this;
        var conds = [];
        if (!Utils.isEmpty(data.address_id)) {
            conds['address_id'] = data.address_id;
        }
        t.selectFields("*");
        return t.findAsync(conds, []);
    }
}
