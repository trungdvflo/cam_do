/**
 * user models.
 * create 2018/01/15
 * @author trungdv
 * @version $Id$
 * @copyright 2018 MIT
 */ 

var baseModel = require('./baseModel');

module.exports = class aclActionModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "acl_action", "id");
    }

    // query function here
}
