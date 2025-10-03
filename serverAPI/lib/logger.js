/**
 * @author trungdv
 */
var winston = require('winston');
const Configs = require('../config/configs.js');

var path = ROOT_PATH+"/logs/";
var filename = "log.log";
if (Configs.log_path){
    path =ROOT_PATH + Configs.log_path
}
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: path+'info-'+filename,
            level: 'info',
            json : false,
            maxsize: 2048000,
            maxFiles: 5
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: path+'error-'+filename,
            handleExceptions: true,
            level: 'error',
            json : false,
            maxsize: 10240000,
            maxFiles: 5
        })
    ]
});

logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

// info, debug, error
logger.level = Configs.log_level;

logger.cli();
module.exports = logger;
