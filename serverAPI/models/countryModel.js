var baseModel = require('./baseModel');

module.exports = class countryModel extends baseModel{
    constructor(dbConn){
        super(dbConn, "country", "country_id");
    }

    // query function here
}
