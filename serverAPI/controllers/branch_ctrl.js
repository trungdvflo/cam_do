/**
 * branch controller.
 * create 2018/02/26
 * @author khanhvq
 * @version $Id$
 * @copyright 2017 MIT
 */ 

const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const base_ctrl = require('../controllers/base_ctrl.js');
const logger = require('../lib/logger.js');
var branchModel = require('../models/branchModel.js');

module.exports = class branch_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }
    index () { 
        var data = {}
        this.responeData(data, true, 200, "success");
    }

    /**
     * find branch action
     * @author: trungdv
     */
    find () {
        var t = this;
        var data = {};
        var branchM = new branchModel(t.db);
        var cond = [];
        if(Utils.isSet(t.req.body.vi_name)){
            cond['vi_name LIKE'] = '%'+t.req.body.vi_name+'%';
        }
        var orderby = [];
        orderby['branch_id']  = 'ASC';
        branchM.findAsync(cond, orderby).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, this.constructor.name+".find");
            t.responeData(data, false, 301, "fail");
        })
    }
    /**
     * save action
     * @author: trungdv
     */
     save () {
        var data = this.req.body;
        var t = this;
        if(!t.hasPermission('catetory_department')){
            logger.error('permission catetory_department', this.constructor.name+".save");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if(!data || !data.vi_name){
            logger.error('error data request', this.constructor.name+".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }

        var branchM = new branchModel(t.db);
        data.en_name = Utils.convertVietnameseToViEn(data.vi_name);
        if(!Utils.isEmpty(data.vi_description)){
            data.en_description = Utils.convertVietnameseToViEn(data.vi_description);
        }else{
            data.en_description = Constants.BLANK;
        }
        if(!data.branch_id){
            branchM.insertAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể insert");
            })
        }else{
            branchM.updateAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể update");
            })
        }
    }
}