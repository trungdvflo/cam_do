/**
 * branch models.
 * create 2018/03/29
 * @author khanhvq
 * @version $Id$
 * @copyright 2018 MIT
 */ 

var baseModel = require('./baseModel');

module.exports = class user_branchModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "user_branch", "id");
    }

    // query function here
}
