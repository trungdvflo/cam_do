/**
 * base controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const logger_shell= require('../lib/logger.shell.js');
const cacheManager = require('../lib/cacheManager.js');
var baseModel = require('../models/baseModel.js');

module.exports = class base_sh {
    beforeFilter(db, option, options){
        this.db = db;
        this.option = option;
        this.options = options;
    }

    endShell(data, success, msg){
        this.option.result_text = msg;
        this.option.success = success;
        //AppDebug.log('option, options', this.option, this.options);
        cacheManager.set('shells_options', this.options, 30*24*60);
        if(isConnRelease){
            if(this.db){
                try{
                    this.db.release();
                    //AppDebug.log('Release db connection');
                }catch(err){ logger_shell.error('Can not release connection ', this.constructor.name ); }
            }
        }
        actEndTime = new Date().getTime();
        var reqDuration = actEndTime - actStartTime
        AppDebug.log('actStartTime-actEndTime: ' + reqDuration);
        logger_shell.info('END shell: ','actStartTime-actEndTime: ' + reqDuration);
        AppDebug.log('===============End Shell===============');
        AppDebug.log(' ');
        logger_shell.log(' ', ' ')
        if(reqDuration>1000){
            logger_shell.error('SLOW REQUEST: '+reqDuration, this.constructor.name );
            logger_shell.error('SLOW REQUEST Data: ', ""); 
        }
    }
}
