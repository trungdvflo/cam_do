/**
 * user models.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */

var baseModel = require('./baseModel');

module.exports = class userModel extends baseModel {
    constructor(dbConn) {
        super(dbConn, "user", "user_id");
    }

    async get_user(person_id) {
        var conds = [];
        var orderBy = [];
        conds['person_id'] = person_id;
        return this.firstAsync(conds, orderBy);
    }
    // query function here
}