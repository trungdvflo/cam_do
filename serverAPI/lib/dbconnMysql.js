/**
 * Configs.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

const mysql = require('mysql');
const Configs = require(global.ROOT_PATH+'/config/configs.js');
const AppDebug = require(global.ROOT_PATH+'/lib/appDebug.js');

module.exports = class dbconnMysql {
    constructor(){
        this.conn = null;
    }

    static getPool(){
        if(dbconnMysql.pool == null){
            dbconnMysql.pool = mysql.createPoolCluster();

            // Add master pool
            dbconnMysql.pool.add("MASTER", Configs.dbconfig);

            if (Configs.enableSlaveConnection && Configs.dbSlaveConfig.length > 0) {
                Configs.dbSlaveConfig.map((slave, index) => {
                    dbconnMysql.pool.add(`SLAVE${index}`, slave);
                });
            }
            // dbconnMysql.pool = mysql.createPool(Configs.dbconfig);
            // AppDebug.log('get new Pool');
        }
        
        return dbconnMysql.pool;
    }

    static getPoolOther(){
        if(dbconnMysql.poolOthers == null){
            dbconnMysql.poolOthers = {};
            if (Configs.dbOtherConfig) {
                for (let name in Configs.dbOtherConfig){
                    dbconnMysql.poolOthers[name] = mysql.createPool(Configs.dbOtherConfig[name]);
                    AppDebug.log('get new Pool Other: ' + name);
                }
            }
        }
        
        return dbconnMysql.poolOthers;
    }

    static getConn(){
        if(this.conn==null){
            var connection = mysql.createConnection(Configs.dbconfig);
            AppDebug.log('get new Conn');
            connection.connect(function(err) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }else{
                    console.log('connected as id ' + connection.threadId);
                }
            });
            this.conn = connection;
        }
        return this.conn;
    }

    getConnPool(callback){
        dbconnMysql.getPool().getConnection("MASTER", function(err, connection){
            callback(err, connection);
        });
    }

    getSlaveConnPool(callback) {
        dbconnMysql.getPool().getConnection("SLAVE*", function(err, connection){
            callback(err, connection);
        });
    }

    getConnPoolOther(){
        const poolOthers = dbconnMysql.getPoolOther();
        let dbOthers = {}
        for (let key in poolOthers){
            poolOthers[key].getConnection(function(err, connection){
                dbOthers[key] = connection;
            });
        }
        return dbOthers;
    }

    
    checkDBConn(){
        try{
            this.getConnPool(function(err, connection) {
                if (err){
                    console.log("[Connection error] fail connect to Mysql databasse");
                    AppDebug.log(err);
                }else{
                    console.log("connect SUCCESS to Mysql databasse");
                    connection.release();
                }
            })
        }catch(ex){
            console.log(ex);
        }
    }

}