/**
 * Base Model.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
const mysql = require('mysql');
const Configs = require(global.ROOT_PATH+'/config/configs.js');
const Constants = require(global.ROOT_PATH+'/lib/constants.js');
const AppDebug = require(global.ROOT_PATH+'/lib/appDebug.js');
var dbconnMyssql = require(global.ROOT_PATH+'/lib/dbconnMysql.js');

module.exports = class baseModel{
    constructor(db, table, key="id", isOther=false){
        this.db = db;
        this.table = table;
        this.key = key;
        this.selFields = '*';
        this.joinTb = '';
        this.group_by = '';
        this._having = '';
        this.use_seq = true;
        this.isOther = isOther;;
    }
    escape(val){
        if(val){
            return this.db.escape(val);
        }else{
            return val;
        }
    }
    escape4In(val){
        if(typeof val == 'string' && val.indexOf("','")>0){
            //val = val.split("'").join();
            val = val.slice(0, -1);
            val = val.substr(1);
            var vals = val.split("','");
            var res = ""
            for(let v of vals){
                res += this.db.escape(v) + ","
            }
            if(res != ""){
                res = res.slice(0, -1);
            }
            return res;
        }else{
            //return this.db.escape(val);
            return val;
        }
    }
    buildWhere(conds){
        var where = ' WHERE 1' + this.buildConds(conds);

        return where;
    }
    buildConds(conds){
        var where = ' ';
        for (let k in conds){
            if (typeof conds[k] == 'object') {
                var g_cond = "";
                var objArray = conds[k];
                for (let i in objArray){
                    var dk = i.toLowerCase();
                    if(dk.indexOf(">")>0 || dk.indexOf("<")>0 || dk.indexOf("=")>0 || dk.indexOf(" like")>0 || dk.indexOf(" is")>0){
                        g_cond += k + " " + i + " " + this.escape(objArray[i]);
                    }else if(dk.indexOf(" in")>0){
                        where += " AND " + k + " (" + this.escape4In(objArray[i])+")";
                    }else{
                        g_cond += k + " " + i + "= " + this.escape(objArray[i]);
                    }
                    g_cond += " ";
                }
                if(g_cond != ""){
                    g_cond = g_cond.slice(k.length);
                    where += " AND (" +g_cond+ ")";
                } 
            }else{
                var dk = k.toLowerCase();
                if(dk.indexOf(">")>0 || dk.indexOf("<")>0 || dk.indexOf("=")>0 || dk.indexOf(" like")>0 || dk.indexOf(" is")>0){
                    where += " AND " + k + " " + this.escape(conds[k]);
                }else if(dk.indexOf(" in")>0){
                    where += " AND " + k + " (" + this.escape4In(conds[k])+")";
                }else{
                    where += " AND " + k + "= " + this.escape(conds[k]);
                }
            }
        }

        return where;
    }
    /**
     * set fields are using in group by
     * ex: fields = 'id, name';  fields = ['id', 'name'];
     * @param {* String list fields or Array fields} fields 
     */
    selectFields(fields){
        if(typeof fields === 'array'){
            this.selFields = '';
            for (let i = 0; i < fields.length; i++) { 
                this.selFields += "`"+fields[i] + "`,";
            }
            if(this.selFields != ""){
                this.selFields = this.selFields.slice(0, -1);
            }else{
                this.selFields = '*';
            }
        }else{
            this.selFields = fields;
        }
    }
    /**
     * set fields are using in select (first, find, paging)
     * ex: Group by id, name => fields = 'id, name';  fields = ['id', 'name'];
     * @param {* String list fields or Array fields} fields 
     */
    groupBy(fields){
        if(typeof fields === 'array'){
            this.group_by = '';
            for (let i = 0; i < fields.length; i++) { 
                this.group_by += "`"+fields[i] + "`,";
            }
            if(this.group_by != ""){
                this.group_by = this.group_by.slice(0, -1);
            }
        }else{
            this.group_by = fields;
        }
        this.group_by = ' GROUP BY ' + this.group_by;
    }
    /**
     * set fields are using in select (first, find, paging)
     * ex: having id=0, name="a" => fields = 'id=0, name="a"';  
     * @param {* String list fields } fields 
     */
    having(fields){
        this._having = ' HAVING ' + fields;
    }
    /**
     * set join table of select (first, find, paging)
     * @param {* table name} _table 
     * @param {* join condition} _join 
     * @param {* type of join (left, right, inner)} _type 
     */
    join(_table, _join, _type){
        this.joinTb += " "+_type +" JOIN "+_table+" ON "+_join+" ";
    }

    /**
     * get record by primary key
     * @param {* primary key (id) value of the record} key 
     */
    getByKeyAsync(key) {
        return new Promise((resolve, reject) => {
            try{
                var sql = "SELECT "+this.selFields+" FROM `"+this.table +"`"+this.joinTb+" WHERE `"+this.key+"`='"+key+"'";
                AppDebug.log(sql);
                this.db.query(sql, function(err, result){
                    if(err){ 
                        AppDebug.log(err); reject(err); return;
                    }else{
                        if(result[0]){
                            resolve(result[0]);
                        }else{
                            reject(result);
                        }
                    }
                });
            }catch(ex){
                reject(ex);
            }
        })
    }
    /**
     * get record by primary key
     * @param {* primary key (id) value of the record} key 
     * @param {* function (err, result)} callback 
     */
    getByKey(key, callback) {
        var sql = "SELECT "+this.selFields+" FROM `"+this.table +"`"+this.joinTb+" WHERE `"+this.key+"`='"+key+"'";
        try{
            this.db.query(sql, function(err, result){
                if(err) AppDebug.log(err);
                callback(err, result[0]);
            });
        }catch(ex){
            callback(ex, null);
        }
    }

    /**
     * insert the object (one record) to the table
     * @param {* value of one record} obj 
     */
    insertAsync(obj) {
        var t = this;
        return new Promise((resolve, reject) => {
            try{
                var sql = "INSERT INTO `"+t.table+"` SET ?";
                t.db.query(sql, obj, function(err, result){
                    if(err){
                        AppDebug.log(err); reject(err); return;
                    }else{
                        AppDebug.log('INSERT INTO [' +t.table + '] success with result: ', result);
                        resolve(result);
                    }
                });
            }catch(ex){
                reject(ex);
            }
        })
    }
    /**
     * replace the object (one record) to the table
     * @param {* value of one record} obj 
     */
    replaceAsync(obj) {
        var t = this;
        return new Promise((resolve, reject) => {
            try{
                var sql = "REPLACE INTO `"+t.table+"` SET ?";
                t.db.query(sql, obj, function(err, result){
                    if(err){ 
                        AppDebug.log(err); reject(err); return;
                    }else{
                        AppDebug.log('REPLACE INTO [' +t.table + '] success');
                        resolve(result);
                    }
                });
            }catch(ex){
                reject(ex);
            }
        })
    }
    /**
     * insert the object (one record) to the table
     * @param {* value of one record} obj 
     * @param {* function (err, result)} callback 
     */
    insert(obj, callback) {
        var sql = "INSERT INTO `"+this.table+"` SET ?";
        try{
            this.db.query(sql, obj, function(err, result){
                if(err) AppDebug.log(err);
                callback(err, result);
            });
        }catch(ex){
            callback(ex, null);
        }
    }

    /**
     * insert all records of array objects to the table
     * @param {* array objects (list records)} objs 
     */
    insertAllAsync(objs) {
        var t = this;
        return new Promise((resolve, reject) => {
            try{
                var fields = "";
                var obj = objs[0];
                for(let k in obj){ 
                    fields += k + "`,`";
                }
                if(fields != "") fields = fields.slice(0, -3);
                var objsArray = [];
                for(let i=0; i<objs.length; i++){
                    var objArray = [];
                    var obj = objs[i];
                    for(var k in obj){
                        objArray.push(obj[k]);
                    }
                    objsArray.push(objArray);
                }
                var sql = "INSERT INTO `"+t.table+"` (`"+fields+"`) VALUES ?";
                t.db.query(sql, [objsArray], function(err, result){
                    if(err){ 
                        AppDebug.log(err); reject(err); return;
                    }else{
                        resolve(result);
                    }
                });
            }catch(ex){
                reject(ex);
            }
        })
    }
    /**
     * insert all records of array objects to the table
     * @param {* array objects (list records)} objs 
     * @param {* function (err, result)} callback 
     */
    insertAll(objs, callback) {
        var fields = "";
        var obj = objs[0];
        for(let k in obj){
            fields += k + "`,`";
        }
        if(fields != "") fields = fields.slice(0, -3);
        var objsArray = [];
        for(let i=0; i<objs.length; i++){
            var objArray = [];
            var obj = objs[i];
            for(let k in obj){
                objArray.push(obj[k]);
            }
            objsArray.push(objArray);
        }
        var sql = "INSERT INTO `"+this.table+"` (`"+fields+"`) VALUES ?";
        try{
            this.db.query(sql, [objsArray], function(err, result){
                if(err) AppDebug.log(err);
                callback(err, result);
            });
        }catch(ex){
            callback(ex, null);
        }
    }

    /**
     * update the object (one record) to the table
     * @param {* the object (one record)} obj 
     * @param {* array condition to update, for handle multi update} conds 
     */
    updateAsync(obj, conds) {
        var t = this;
        return new Promise((resolve, reject) => {
            try{
                var where = t.buildConds(conds);
                if(obj[t.key]){
                    var sql = "UPDATE `"+t.table+"` SET ? WHERE `"+t.key+"`= ? " + where;
                } else if(where.trim()!=''){
                    var sql = "UPDATE `"+t.table+"` SET ? WHERE 1 " + where;
                } else{
                    AppDebug.log(obj); reject('none update conditions '+t.table);
                    return;
                }
                AppDebug.log(sql);
                AppDebug.log(obj, conds);
                t.db.query(sql, [obj,obj[t.key]], function(err, result){
                    if(err){ 
                        err[t.key] = obj[t.key];
                        AppDebug.log(err); reject(err); 
                    }else if(result.affectedRows == 0){
                        err = {
                            msg:'No match' + sql,
                            'id':obj[t.key]
                        }
                        AppDebug.log('can not UPDATE [' +t.table + '] cause with ' + t.key + '= '+obj[t.key]);
                        reject(err);
                    }else{
                        AppDebug.log('UPDATE [' +t.table + '] success with ' + t.key + '= '+obj[t.key]);
                        result[t.key] = obj[t.key];
                        resolve(result);
                    }
                });
            }catch(ex){
                ex[t.key] = obj[t.key];
                AppDebug.log('cant update table '+ t.table);
                reject(ex);
            }
        })
    }
    /**
     * update the object (one record) to the table
     * @param {* the object (one record)} obj 
     * @param {* array condition to update, for handle multi update} conds 
     * @param {* function (err, result)} callback 
     */
    update(obj, conds, callback) {
        var where = this.buildConds(conds);
        var sql = "UPDATE `"+this.table+"` SET ? WHERE `"+this.key+"`= ? " + where;
        try{
            this.db.query(sql, [obj,obj[this.key]], function(err, result){
                if(err){ AppDebug.log(err);
                }else if(result.affectedRows == 0) err = 'No match';
                callback(err, result);
            });
        }catch(ex){
            callback(ex, null);
        }
    }

    /**
     * delete the record by key value
     * @param {* primary key (id) value of the record} key 
     */
    deleteAsync(key, conds) {
        var t = this;
        if(!conds) conds = []
        return new Promise((resolve, reject) => {
            try{
                var where = t.buildConds(conds);
                var sql = "DELETE from `"+t.table+"` WHERE `"+t.key+"`= ?" + where;
                t.db.query(sql, [key], function(err, result){
                    if(err){ 
                        AppDebug.log(err); reject(err); return;
                    }else{
                        AppDebug.log('DELETE from [' +t.table + '] success');
                        resolve(result);
                    }
                });
            }catch(ex){
                reject(ex);
            }
        })
    }
    /**
     * delete the record by key value
     * @param {* primary key (id) value of the record} key 
     * @param {* function (err, result)} callback 
     */
    delete(key, callback) {
        var sql = "DELETE from `"+this.table+"` WHERE `"+this.key+"`= ?";
        try{
            this.db.query(sql, [key], function(err, result){
                if(err) AppDebug.log(err);
                callback(err, result);
            });
        }catch(ex){
            callback(ex, null);
        }
    }

    /**
     * delete all record by array keys value
     * @param {* array of keys value} keys 
     */
    deleteAllAsync(keys) {
        var t = this;
        return new Promise((resolve, reject) => {
            try{
                var sql = "DELETE from `"+t.table+"` WHERE (`"+t.key+"`) IN (?)";

                t.db.query(sql, [keys], function(err, result){
                    if(err){ 
                        AppDebug.log(err); reject(err); 
                    }else{
                        resolve(result);
                    }
                });
            }catch(ex){
                reject(ex);
            }
        })
    }
    /**
     * delete all record by array keys value
     * @param {* array of keys value} keys 
     * @param {* function (err, result)} callback 
     */
    deleteAll(keys, callback) {
        var sql = "DELETE from `"+this.table+"` WHERE (`"+this.key+"`) IN (?)";
        try{
            this.db.query(sql, [keys], function(err, result){
                if(err) AppDebug.log(err);
                callback(err, result);
            });
        }catch(ex){
            callback(ex, null);
        }
    }

    /**
     * find the first record by array condition
     * @param {* array of condition} conds 
     */
    firstAsync(conds, orders) {
        var t=this;
        orders = orders | []
        return new Promise((resolve, reject) => {
            try{
                t.find(conds, orders, function(err, result){
                    if(err){ 
                        AppDebug.log(err); reject(err); 
                    }else if(result && result.length>0){
                        resolve(result[0]);
                    }else{
                        resolve(result);
                    }
                });
            }catch(ex){
                AppDebug.log(ex);
                reject(ex);
            }
        })
    }
    /**
     * find the first record by array condition
     * @param {* array of condition} conds 
     * @param {* function (err, result)} callback 
     */
    first(conds, orders, callback) {
        orders = orders | []
        this.find(conds, orders, function(err, result){
            if(result[0]){
                callback(err, result[0]);
            }else{
                callback(err, result);
            }
        });
    }

    /**
     * find all record by array condition
     * @param {* array of condition} conds 
     * @param {* array of orderby} orders 
     * @param {* number limit (optional)} limit 
     */
    findAsync(conds, orders, limit) {
        var t = this;
        return new Promise((resolve, reject) => {
            try{
                var where = t.buildWhere(conds);
                var order_by = '';
                for(let k in orders){
                    order_by += k + " " + orders[k] + ",";
                }
                if(order_by != ''){
                    order_by = order_by.slice(0, -1);
                    order_by = ' ORDER BY ' + order_by; 
                }

                var sql = "SELECT "+t.selFields+" FROM `"+t.table +"`"+t.joinTb + where + t.group_by + t._having + order_by;
               
                if(limit && limit>0){
                    sql += ' LIMIT ' + limit;
                }
                AppDebug.log("Show "+sql);

                // lvlinh: if slave connection is enabled, then query from slave
                if (!t.isOther && Configs.enableSlaveConnection && Configs.dbSlaveConfig.length > 0)  {
                    global.db.getSlaveConnPool((err, dbConn) => {
                        dbConn.query(sql, function(err, result){
                            if(err){ 
                                AppDebug.log(err); reject(err); 
                            }else{
                                resolve(result);
                            }
                        });
                    });
                } 
                else {
                    t.db.query(sql, function(err, result){
                        if(err){ 
                            AppDebug.log(err); reject(err); 
                        }else{
                            resolve(result);
                        }
                    });
                }
            }catch(ex){
                reject(ex);
            }
        })
    }
    /**
     * find all record by array condition
     * @param {* array of condition} conds 
     * @param {* array of orderby} orders 
     * @param {* function (err, result)} callback 
     */
    find(conds, orders, callback) {
        var where = this.buildWhere(conds);
        var order_by = '';
        for(let k in orders){
            order_by += k + " " + orders[k] + ",";
        }
        if(order_by != ''){
            order_by = order_by.slice(0, -1);
            order_by = ' ORDER BY ' + order_by; 
        }

        var sql = "SELECT "+this.selFields+" FROM `"+this.table +"`"+this.joinTb + where + this.group_by + this._having + order_by;
        try{
            AppDebug.log(sql);

            // lvlinh: if slave connection is enabled, then query from slave
            if (!this.isOther && Configs.enableSlaveConnection && Configs.dbSlaveConfig.length > 0)  {
                global.db.getSlaveConnPool((err, dbConn) => {
                    dbConn.query(sql, function(err, result){
                        if(err) AppDebug.log(err);
                        callback(err, result);
                    });
                });
            }
            else {
                this.db.query(sql, function(err, result){
                    if(err) AppDebug.log(err);
                    callback(err, result);
                });
            }
            // this.db.query(sql, function(err, result){
            //     if(err) AppDebug.log(err);
            //     callback(err, result);
            // });
        }catch(ex){
            callback(ex, null);
        }
    }

    /**
     * find and paging 
     * @param {* array of condition} conds 
     * @param {* array of orderby} orders 
     * @param {* page number of result} page 
     * @param {* row (record) per page} row_per_page 
     */
    pagingAsync(conds, orders, page, row_per_page) {
        var t = this;
        return new Promise((resolve, reject) => {
            try{
                var where = t.buildWhere(conds);
                var total_record = 0;
                if(!page || page<1) page = 1;
                var start_count = (page-1)*row_per_page
                var sql_c = "SELECT COUNT(*) as r_count FROM (";
                sql_c += "SELECT "+t.selFields+" FROM `"+t.table+"`"+t.joinTb + where + t.group_by + t._having;     
                sql_c += ' LIMIT '+ Constants.PAGING_LIMIT + ' OFFSET ' + start_count;   // avoid slowly
                sql_c += ") tmp";

                // lvlinh: if slave connection is enabled, then query from slave
                if (!t.isOther && Configs.enableSlaveConnection && Configs.dbSlaveConfig.length > 0)  {
                    global.db.getSlaveConnPool((err, dbConn) => {
                        dbConn.query(sql_c, function(err, result){
                            if(err){ 
                                AppDebug.log(err);
                                reject(err);
                            }else{
                                // CODE DUPLICATE WITH BELLOW, NEED IMPROVE
                                total_record = result[0].r_count + start_count;
                                var limit = '';
                                if(total_record>row_per_page){
                                    if(page*row_per_page>total_record){
                                        page = parseInt((total_record-1)/row_per_page) + 1;
                                    }
                                    var start = (page-1)*row_per_page;
                                    limit = ' LIMIT '+ row_per_page + ' OFFSET ' + start;
                                }
                                var paging = {};
                                paging.current_page = page;
                                paging.row_per_page = row_per_page;
                                paging.total_record = total_record;
                                var order_by = '';
                                for(let k in orders){
                                    order_by += k + " " + orders[k] + ",";
                                }
                                if(order_by != ''){
                                    order_by = order_by.slice(0, -1);
                                    order_by = ' ORDER BY ' + order_by; 
                                }
                        
                                var sql = "SELECT "+t.selFields+" FROM `"+t.table+"`"+t.joinTb + where + t.group_by + t._having + order_by + limit;
                                AppDebug.log(sql);
                                dbConn.query(sql, function(err, result){
                                    if(err){ 
                                        AppDebug.log(err); reject(err); 
                                    }else{
                                        var data = {
                                            data_list : result,
                                            paging : paging
                                        };
                                        resolve(data);
                                    }
                                });
                            }
                        });
                    });
                }
                else {
                    t.db.query(sql_c, function(err, result){
                        if(err){ 
                            AppDebug.log(err);
                            reject(err);
                        }else{
                            // CODE DUPLICATE WITH BELLOW, NEED IMPROVE
                            total_record = result[0].r_count + start_count;
                            var limit = '';
                            if(total_record>row_per_page){
                                if(page*row_per_page>total_record){
                                    page = parseInt((total_record-1)/row_per_page) + 1;
                                }
                                var start = (page-1)*row_per_page;
                                limit = ' LIMIT '+ row_per_page + ' OFFSET ' + start;
                            }
                            var paging = {};
                            paging.current_page = page;
                            paging.row_per_page = row_per_page;
                            paging.total_record = total_record;
                            var order_by = '';
                            for(let k in orders){
                                order_by += k + " " + orders[k] + ",";
                            }
                            if(order_by != ''){
                                order_by = order_by.slice(0, -1);
                                order_by = ' ORDER BY ' + order_by; 
                            }
                    
                            var sql = "SELECT "+t.selFields+" FROM `"+t.table+"`"+t.joinTb + where + t.group_by + t._having + order_by + limit;
                            AppDebug.log(sql);
                            t.db.query(sql, function(err, result){
                                if(err){ 
                                    AppDebug.log(err); reject(err); 
                                }else{
                                    var data = {
                                        data_list : result,
                                        paging : paging
                                    };
                                    resolve(data);
                                }
                            });
                        }
                    });
                }
            }catch(ex){
                reject(ex);
            }
        })
    }
    /**
     * find and paging 
     * @param {* array of condition} conds 
     * @param {* array orderby} orders 
     * @param {* page number of result} page 
     * @param {* row (record) per page} row_per_page 
     * @param {* function(err, result)} callback 
     */
    paging(conds, orders, page, row_per_page, callback) {
        var where = this.buildWhere(conds);
        var total_record = 0;
        var t = this;
        var sql_c = "SELECT COUNT(*) as r_count FROM (";
        sql_c += "SELECT "+t.selFields+" FROM `"+t.table+"`"+t.joinTb + where + t.group_by + t._having;     
        sql_c += ' LIMIT '+ Constants.PAGING_LIMIT + ' OFFSET ' + start_count;   // avoid slowly
        sql_c += ") tmp";
        try{
            // lvlinh: if slave connection is enabled, then query from slave
            if (!t.isOther && Configs.enableSlaveConnection && Configs.dbSlaveConfig.length > 0)  {
                global.db.getSlaveConnPool((err, dbConn) => {
                    dbConn.query(sql_c, function(err, result){
                        if(err){ 
                            AppDebug.log(err);
                        }else{
                            total_record = result[0].r_count;
                            var limit = '';
                            if(total_record>row_per_page){
                                if(page<1){
                                    page = 1;
                                }else if(page*row_per_page>total_record){
                                    page = parseInt((total_record-1)/row_per_page) + 1;
                                }
                                var start = (page-1)*row_per_page;
                                //var end = start +
                                limit = ' LIMIT '+ row_per_page + ' OFFSET ' + start;
                            }else{
                                page = 1;
                            }
                            var paging = {};
                            paging.current_page = page;
                            paging.row_per_page = row_per_page;
                            paging.total_record = total_record;
                            var order_by = '';
                            for(let k in orders){
                                order_by += k + " " + orders[k] + ",";
                            }
                            if(order_by != ''){
                                order_by = order_by.slice(0, -1);
                                order_by = ' ORDER BY ' + order_by; 
                            }
                    
                            var sql = "SELECT "+t.selFields+" FROM `"+t.table+"`"+t.joinTb + where + t.group_by + t._having + order_by + limit;
                    
                            dbConn.query(sql, function(err, result){
                                if(err) AppDebug.log(err);
                                var data = {
                                    data_list : result,
                                    paging : paging
                                };
                                callback(err, data);
                            });
                        }
                    });
                });
            }
            else {
                this.query(sql_c, function(err, result){
                    if(err){ 
                        AppDebug.log(err);
                    }else{
                        total_record = result[0].r_count;
                        var limit = '';
                        if(total_record>row_per_page){
                            if(page<1){
                                page = 1;
                            }else if(page*row_per_page>total_record){
                                page = parseInt((total_record-1)/row_per_page) + 1;
                            }
                            var start = (page-1)*row_per_page;
                            //var end = start +
                            limit = ' LIMIT '+ row_per_page + ' OFFSET ' + start;
                        }else{
                            page = 1;
                        }
                        var paging = {};
                        paging.current_page = page;
                        paging.row_per_page = row_per_page;
                        paging.total_record = total_record;
                        var order_by = '';
                        for(let k in orders){
                            order_by += k + " " + orders[k] + ",";
                        }
                        if(order_by != ''){
                            order_by = order_by.slice(0, -1);
                            order_by = ' ORDER BY ' + order_by; 
                        }
                
                        var sql = "SELECT "+t.selFields+" FROM `"+t.table+"`"+t.joinTb + where + t.group_by + t._having + order_by + limit;
                
                        t.db.query(sql, function(err, result){
                            if(err) AppDebug.log(err);
                            var data = {
                                data_list : result,
                                paging : paging
                            };
                            callback(err, data);
                        });
                    }
                });
            }
        }catch(ex){
            callback(ex, null);
        }
    }

    /**
     * query
     * @param {* sql statement} sql 
     */
    queryAsync(sql) {
        return new Promise((resolve, reject) => {
            try{
                AppDebug.log(sql);
                this.db.query(sql, function(err, result){
                    if(err){ 
                        AppDebug.log(err); reject(err); 
                    }else{
                        resolve(result);
                    }
                });
            }catch(ex){
                reject(ex);
            }
        })
    }
    /**
     * query with param
     * @param {* sql statement} sql 
     * @param {* param of statement} param 
     */
    queryParam(sql, param) {
        return new Promise((resolve, reject) => {
            try{
                AppDebug.log(sql);
                this.db.query(sql, param, function(err, result){
                    if(err){ 
                        AppDebug.log(err); reject(err); 
                    }else{
                        resolve(result);
                    }
                });
            }catch(ex){
                reject(ex);
            }
        })
    }

}