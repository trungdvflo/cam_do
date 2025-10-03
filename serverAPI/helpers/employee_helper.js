/**
 * user controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
const Configs = require('../config/configs.js');
const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const logger = require('../lib/logger.js');
var userModel = require('../models/userModel.js');

module.exports = class employee_helper {
    /**
     * cap nhat perion_id khi sua empployee
     * @param {*} username 
     * @param {*} pId 
     */
    static updatePersonId4User(db, username, pId) {
        if (username) {
            var u = new userModel(db);
            var conds = [];
            conds['username'] = username;
            u.findAsync(conds).then(result => {
                var data = result[0];
                if (data.person_id==null || Utils.isEmpty(data.person_id)) {
                    var uUp = {
                        user_id: data.user_id,
                        person_id: pId
                    }
                    u.updateAsync(uUp).then(result => {
                        AppDebug.log('Update person id: ' + pId);
                    }).catch(err => {
                        logger.error(err, "employee_helper.updatePersonId4User");
                    })
                }
            })
        }
    }
}