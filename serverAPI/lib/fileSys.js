/**
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

var fs = require('fs');
var pathFS = require('path');
var Configs = require('../config/configs.js');
const AppDebug = require('./appDebug.js');
const logger = require('./logger.js');

module.exports = class fileSys {

    /**
     * Make dir recursive
     * @param {*} dirPath 
     * @param {*} mode 
     * @param {*} callback 
     */
    static mkdirRecursive(dirPath, mode, callback) {
        if (!fs.existsSync(dirPath)){
            fs.mkdir(dirPath, mode, function(error) {
                //When it fail in this way, do the custom steps
                if (error && error.code === 'ENOENT') {
                    //Create all the parents recursively
                    fileSys.mkdirRecursive(pathFS.dirname(dirPath), mode, function(){
                        //And then the directory
                        fileSys.mkdirRecursive(dirPath, mode, callback);
                    });
                }else{
                    //Manually run the callback since we used our own callback to do all these
                    callback && callback(error);
                }
            });
        }else{
            callback && callback(null);
        }
    };
}