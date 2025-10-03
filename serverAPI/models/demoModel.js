/**
 * user models.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

var baseModel = require('./baseModel');

module.exports = class demoModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "demo", "id");
    }

    // query function here
}
