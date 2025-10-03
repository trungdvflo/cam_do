var baseModel = require('./baseModel');

module.exports = class manufacturerModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "manufacturer", "manufacturer_id");
    }

    // query function here
}
