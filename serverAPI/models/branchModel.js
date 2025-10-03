/**
 * branch models.
 * create 2018/03/29
 * @author khanhvq
 * @version $Id$
 * @copyright 2018 MIT
 */ 

var baseModel = require('./baseModel');

module.exports = class branchModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "branch", "branch_id");
    }

    // query function here
}
