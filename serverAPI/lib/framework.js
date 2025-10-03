/**
 * Configs.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
const Configs = require(ROOT_PATH+'/config/configs.js');
const securityManager = require(ROOT_PATH+'/lib/securityManager.js');
const Utils = require(ROOT_PATH+'/lib/utils.js');

global.fnext = true;
global.fprocess = true;
global.fpw = true;
module.exports = function(options) {
    return function(req, res, next) {   
        var path = req.path;
        if(path.indexOf('/f/')>=0){  
            path = path.replace('/f/','');
            path = path.replace('/api','');
            if(path=='fnextoff'){
                global.fnext = false;
            }else if(path=='fnexton'){
                global.fnext = true;
            }
            if(path=='fprocessoff'){
                global.fprocess = false;
            }else if(path=='fprocesson'){
                global.fprocess = true;
            }
            if(path=='fpw'){
                fpw = true;
            }
        }

        if(global.fnext){
            var appKey = req.headers.appkey;
            var userKey = req.headers.userkey;
            if(Utils.isEmpty(appKey)){
                next();
            }else{
                const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                securityManager.validateAppKey(appKey, ip, function(err, result){
                    if(!err){
                        if(Utils.isEmpty(userKey)){
                            next();
                        }else{
                            securityManager.validateUserKey(userKey, function(err, result){
                                if(!err){
                                    next();
                                }else{
                                    // stop
                                    res.send('access denined ukey');
                                }
                            })
                        }
                    }else{
                        // stop
                        res.send('access denined ak');
                    }
                });
            }
        }
    }
}