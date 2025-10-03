
const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
var demoModel = require('../models/demoModel.js');
const base_sh = require('../shells/base_sh.js');
const logger_shell = require('../lib/logger.shell.js');

module.exports = class demo_sh extends base_sh {
    beforeFilter(db, option, options){
        super.beforeFilter(db, option, options);
    }
    index () { 
        var t = this;
        var data = {
            uinfo: {
                "user_id":      1,
                "username":     "admin",
                "signature_url":    "admin.jpg",
                "persion_id":   0
            },
            security: {
                secret : 'abc123',
            }
        };
        // TODO:
        AppDebug.log(data)
        logger_shell.info("index log demo", "end method");
        this.endShell(data, true, "success");
    }
    test () { 
        var t = this;
        var data = t.option.params;
        // TODO:
        AppDebug.log(data)
        logger_shell.info("index log test..", "end method");
        this.endShell(data, true, "success");
    }

}