
const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
const base_ctrl = require('../controllers/base_ctrl.js');
var demoModel = require('../models/demoModel.js');
const logger = require('../lib/logger.js');

module.exports = class demo_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }
    index () { 
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
        logger.info('', this.constructor.name+".index");
        this.responeData(data, true, 200, "success");
    }

    create_app_key () { 
        // random 64 chars
		var chars = '';
		var temp = '1234567890abcdefghijklmnopqrstuvxyw';
		for(let i=0; i<64; i++){
			let c = Math.floor(Math.random() * 36); 
			console.log('c:', c);
			chars += temp[c];
			console.log('chars:', chars);
		}
		var appKey = chars + '_' + Utils.createSum(chars);
		var res = {
			appKey: appKey
		}
        logger.info('', this.constructor.name+".create_app_key");
        this.responeData(res, true, 200, "success");
    }

    save (){
        var t = this;
        var data = this.req.body;
        try{
            var demo = new demoModel(t.db);
            demo.insert(data, function(err, result){
                if(err){
                    return t.responeData(result, false, 301, "fail");
                }
                t.responeData(result, true, 200, "success");
            });
        }catch(ex){
            this.responeData(data, false, 1001, "System error!"); 
            AppDebug.log(ex);            
        }
        logger.info('', this.constructor.name+".save");
    }
    save_async (){
        var t = this;
        var data = this.req.body;
        try{
            var demo = new demoModel(t.db);
            demo.insertAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err => {
                t.responeData({}, false, 301, err);
            })
        }catch(ex){
            this.responeData(data, false, 1001, "System error!"); 
            AppDebug.log(ex);            
        }
        logger.info('', this.constructor.name+".save");
    }

    save_all (){
        var t = this;
        var data = this.req.body;
        try{
            var demo = new demoModel(t.db);
            demo.insertAll(data, function(err, result){
                if(err){
                    return t.responeData(result, false, 301, "fail");
                }
                t.responeData(result, true, 200, "success");
            });
        }catch(ex){
            this.responeData(data, false, 1001, "System error!"); 
            AppDebug.log(ex);            
        }
        logger.info('', this.constructor.name+".save_all");
    }
    save_all_async (){
        var t = this;
        var data = this.req.body;
        try{
            var demo = new demoModel(t.db);
            demo.insertAllAsync(data).then(result => {
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                t.responeData({}, false, 301, err);
            })
        }catch(ex){
            this.responeData(data, false, 1001, "System error!"); 
            AppDebug.log(ex);            
        }
        logger.info('', this.constructor.name+".save_all");
    }

    delete (){
        var t = this;
        var data = this.req.body;
        try{
            var demo = new demoModel(t.db);
            demo.deleteAll(data, function(err, result){
                if(err){
                    return t.responeData(result, false, 301, "fail");
                }
                t.responeData(result, true, 200, "success");
            });
        }catch(ex){
            this.responeData(data, false, 1001, "System error!"); 
            AppDebug.log(ex);            
        }
        logger.info('', this.constructor.name+".delete");
    }

    update(){
        var t = this;
        var data = this.req.body;
        try{
            var demo = new demoModel(t.db);
            var conds = [];
            //conds['age >'] = 50;
            demo.update(data, conds, function(err, result){
                if(err){
                    return t.responeData(result, false, 301, "fail, "+err);
                }
                // check result.affectedRows if need.
                t.responeData(result, true, 200, "success");
            });
        }catch(ex){
            this.responeData(data, false, 1001, "System error!"); 
            AppDebug.log(ex);            
        }
        logger.info('', this.constructor.name+".update");
    }
    update_async(){
        var t = this;
        var data = this.req.body;
        try{
            var demo = new demoModel(t.db);
            var conds = [];
            //conds['age >'] = 50;
            demo.updateAsync(data, conds).then(result =>{
                // check result.affectedRows if need.
                t.responeData(result, true, 200, "success");
            })
            .catch(err => {
                t.responeData(result, false, 301, "fail, "+err);
            })
        }catch(ex){
            this.responeData(data, false, 1001, "System error!"); 
            AppDebug.log(ex);            
        }
        logger.info('', this.constructor.name+".update");
    }
    
    async insert_update_sync(){
        // save then update
        var t = this;
        var data = this.req.body;
        try{
            var demo = new demoModel(t.db);
            let resInsert = await demo.insertAsync(data);
            AppDebug.log(resInsert.insertId);
            data.name = 'update affer insert:'+resInsert.insertId;
            data.id = resInsert.insertId;
            let resUpdate = await demo.updateAsync(data, []);
            AppDebug.log(resUpdate);
            this.responeData(resInsert, true, 200, "Success full");
        }catch(ex){
            this.responeData(data, false, 1001, "System error!"); 
            AppDebug.log(ex);
        }
        logger.info('', this.constructor.name+".save");
    }

    transaction(){
        var t = this;
        var data = this.req.body;
        t.db.beginTransaction(function(err) {
            if(err){
                t.responeData(data, false, 1002, "Transaction error!"); 
                return AppDebug.log(err);            
            }
            var demo = new demoModel(t.db);
            var promises = [];
            for(var k in data){
                // add to promise array
                promises.push(demo.updateAsync(data[k]));
            }
            // call promise all xu ly 
            Promise.all(promises).then(results =>{
                var resData = {num_success:results.length};
                t.db.commit(function(err) {
                    if (err) {
                        t.db.rollback(function() {
                            throw err;
                        });
                    }
                    t.responeData(resData, true, 200, "success");
                });
            })
            .catch(err =>{
                t.db.rollback(function(){})
                t.responeData(err, false, 301, "fail");
                return AppDebug.log(err); 
            })
        })

        logger.info('', this.constructor.name+".transaction");
    }

    find(){
        var t = this;
        var conds = this.req.body;
        /*
        conds = {
            "id >" : 20,
            "OR":{
                "name LIKE": "admin%"
                ,"age >": "5"
            }
        }// (id>20) AND ((name LIKE 'admin%') OR (age > 5)) */
        var order = {"name":'DESC'};
        try{
            var demo = new demoModel(t.db);
            //demo.selectFields(["id", "name", "age"]);
            //demo.selectFields("id, name, age");
            demo.join("user", "demo.user_id=user.user_id","left")
            demo.find(conds, order, function(err, result){
                if(err){
                    return t.responeData(result, false, 301, "fail");
                }
                t.responeData(result, true, 200, "success");
            });
        }catch(ex){
            this.responeData(conds, false, 1001, "System error!"); 
            AppDebug.log(ex);            
        }
        logger.info('', this.constructor.name+".find");
    }
}