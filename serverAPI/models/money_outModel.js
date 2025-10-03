/**
 * user models.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */

var baseModel = require('./baseModel');
const Utils = require('../lib/utils.js');

module.exports = class money_outModel extends baseModel {
    constructor(dbConn) {
        super(dbConn, "money_out", "id");
    }

};