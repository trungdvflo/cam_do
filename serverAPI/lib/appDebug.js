/**
 * Configs.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

var Configs = require('../config/configs.js');

module.exports = class AppDebug {
    constructor(){

    }

    static log (...args) {
        if(Configs.debug){
            //console.log(obj);
            for(let i = 0; i < args.length; i++) {
                console.log(args[i]);
            }
        }
    }
}
