/**
 * Configs.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
var Configs = {
    port : 2003,
    debug : false,
    
    context_path: '/api',
    app_name: 'coresys',
    env: 'dev',  

    // logger
    log_path : '/logs/',
    log_level : 'info',
    // upload
    upload_sign_path: './client/uploads/users',

    // session live time
    sessionLive: 60*60, // second
    salt:   '1health',
    login_action: 'user/login',
    login_action2: 'user/slogin',

    supper_ad: {
        'username': 'admin'
    },

    // format
    formatLongDate: 'DD/MM/YYYY',
    formatShortDate: 'D/M/YY',

    // database
//*
    dbconfig:   {
        connectionLimit : 10,
        host            : 'localhost',
        port            : '3306',
        user            : 'root',
        password        : '1HAbc!23',
        database        : 'cam_do',
        typeCast: function (field, next) {
            if (field.type == 'DATE') {
                return field.string();
            }
            return next();
        }
    },//*/
    enableSlaveConnection: false,
    dbSlaveConfig: [
        {
            connectionLimit : 10,
            host            : 'localhost',
            port            : '3306',
            user            : 'root',
            password        : '1HAbc!23',
            database        : 'cam_do',
            typeCast: function (field, next) {
                if (field.type == 'DATE') {
                    return field.string();
                }
                return next();
            }
        },
    ],

    dbOtherConfig: {
        'his':{
            connectionLimit : 10,
            host            : 'localhost',
            port            : '3306',
            user            : 'root',
            password        : '1HAbc!23',
            database        : 'cam_do',
            typeCast: function (field, next) {
                if (field.type == 'DATE') {
                    return field.string();
                }
                return next();
            }
        },
    },

    mongoConfig: {
        url: 'mongodb://localhost:27017/',
        dbname: 'OnQuee'
    },
 
    // cache manager
    // cache type: db, memcache, file
    cache_type : 'db',

    // if cache_type is memcachememcache
    memcacheConf:   {
        '192.168.1.115:11211': 1
        ,'192.168.1.115:11211': 1
    },
    memcacheOpt:    {
        maxExpiration: 25920000, 
        poolSize: 10, 
    },

    // apps key
    apps_key: {
        webapp : '55abbe84f48701bc8b3873c72c804bac7a70b3ed2_2942' + '_' + 'webapp',
        droh : '55abbe84f48701bc8b3873c72c804bac7a70b3ed2_2942' + '_' + 'droh'
    },
    app_ips_whitelist: {
        webapp: [
        //    '::1',
        //    '127.0.0.1',
        //    'localhost',
        ],
    },

};
module.exports = Configs;