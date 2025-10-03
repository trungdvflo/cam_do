/**
 * permission controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
const base_ctrl = require('../controllers/base_ctrl.js');
var baseModel = require('../models/baseModel.js');
var userModel = require('../models/userModel.js');
var aclActionModel = require('../models/aclActionModel.js');
const logger = require('../lib/logger.js');

module.exports = class permission_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }

    async load_permission_list () {
        var data = {};
        var t = this;
        var id = t.req.body.id;
        var acl_group_id = t.req.body.acl_group_id
        if(!t.hasPermission('assign_permission')){
            logger.error('permission assign_permission', this.constructor.name+".load_permission_list");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var action_ids = [];
        var action_id_map = [];
        var group_action_ids = [];
        var group_action_id_map = [];
        
        try{
            if(Utils.isSet(id)){
                var user_action_model = new baseModel(t.db, 'acl_user_action_map', 'id');
                var cond = [];
                cond['user_id'] = id;
                var order = [];
                user_action_model.selectFields(['id','acl_action_id']);
                let result = await user_action_model.findAsync(cond, order);            
                for(var k in result){
                    action_ids.push(result[k].acl_action_id)
                    action_id_map[result[k].acl_action_id] = result[k].id
                }

                //*// load group permission
                if(acl_group_id && acl_group_id>0){
                    var user_group_action_model = new baseModel(t.db, 'acl_user_group_action_map', 'id');
                    cond = [];
                    cond['acl_user_group_id'] = acl_group_id;
                    order = [];
                    user_group_action_model.selectFields(['id','acl_action_id']);
                    let result = await user_group_action_model.findAsync(cond, order);
                    
                    for(var k in result){
                        group_action_ids.push(result[k].acl_action_id)
                        group_action_id_map[result[k].acl_action_id] = result[k].id
                    }
                }//*/
            }
        }catch(err){
            logger.error(err, this.constructor.name+".load_permission_list");
            return t.responeData(data, false, 1200, "fail");
        }

        var acl_action_model = new aclActionModel(this.db);
        var conds = [];
        conds['acl_action.isdeleted'] = 0;
		if(t.session.uinfo.user_id != Constants.allow_uid){ // not supper_admin
            conds['acl_action.acl_type <>'] = 'supper_admin';
        }
        var order = [];
        order['acl_group_action_id'] = 'ASC';  // don't remove this
        // order['acl_type_action_id'] = 'ASC';
        order['_type'] = 'ASC';
        acl_action_model.selectFields('acl_action.*, acl_group_action.name as gname, acl_group_action.act_type_id');
        acl_action_model.join('acl_group_action', 'acl_action.acl_group_action_id=acl_group_action.id', 'left');
        acl_action_model.findAsync(conds, order).then(result=>{
            var groups = {};
            var num_on = 0;
            for(var k in result){
                var act = result[k];
                if(!Utils.isSet(groups[act.acl_group_action_id])){
                    num_on = 0;
                    groups[act.acl_group_action_id] = {
                        id: act.acl_group_action_id,
                        gname : act.gname,
                        act_type_id: act.act_type_id,
                        actions: []
                    }
                }
                delete act.gname;
                if(action_ids.includes(act.id)){
                    act.on = true;
                    act.map_id = action_id_map[act.id];
                    num_on++;
                }else if(group_action_ids.includes(act.id)){
                    act.on = true;
                    act.group_map_id = group_action_id_map[act.id];
                    num_on++;
                }
                groups[act.acl_group_action_id].actions.push(act);
                if(num_on == groups[act.acl_group_action_id].actions.length){
                    groups[act.acl_group_action_id].on = true;
                }else{
                    groups[act.acl_group_action_id].on = false;
                }
            }

            t.responeData(groups, true, 200, "success");
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".load_permission_list");
            t.responeData(data, false, 1200, "fail");
        })
    }

    add_user_action_map(){
        var data = {};
        var t = this;
        if(!t.hasPermission('assign_permission')){
            logger.error('permission assign_permission', this.constructor.name+".add_user_action_map");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var user_action_map = t.req.body;
        var user_action_model = new baseModel(t.db, 'acl_user_action_map', 'id');
        var conds = [];
        conds['user_id'] = user_action_map.user_id;
        conds['acl_action_id'] = user_action_map.acl_action_id;
        user_action_model.firstAsync(conds).then(result=>{
            if(Utils.isSet(result) && Utils.isSet(result.id)){
                t.responeData(result, false, 200, "action map is exist");
            }else{
                user_action_model.insertAsync(user_action_map).then(result=>{
                    t.responeData(result, true, 200, "success");
                })
                .catch(err =>{
                    t.responeData(data, false, 1200, "fail");
                })
            }
        })
        .catch(err =>{
            logger.error('permission assign_permission', this.constructor.name+".load_permission_list");
            t.responeData(data, false, 1200, "fail");
        })
    }

    del_user_action_map(){
        var data = {};
        var t = this;
        if(!t.hasPermission('assign_permission')){
            logger.error('permission assign_permission', this.constructor.name+".del_user_action_map");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var user_action_map = t.req.body;
        var user_action_model = new baseModel(t.db, 'acl_user_action_map', 'id');
        var conds = [];
        conds['user_id'] = user_action_map.user_id;
        conds['acl_action_id'] = user_action_map.acl_action_id;
        user_action_model.firstAsync(conds).then(result=>{
            if(Utils.isSet(result) && Utils.isSet(result.id)){
                user_action_model.deleteAsync(result.id).then(result=>{
                    t.responeData(result, true, 200, "success");
                })
                .catch(err =>{
                    logger.error(err, this.constructor.name+".del_user_action_map");
                    t.responeData(data, false, 1200, "fail");
                })
            }else{
                t.responeData(result, false, 200, "action map is NOT exist");
            }
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".del_user_action_map");
            t.responeData(data, false, 1200, "fail");
        })
    }

    /**
     * xoa toan bo quyen cua user
     */
    del_user_action_map_all(){
        var data = {};
        var t = this;
        if(!t.hasPermission('assign_permission')){
            logger.error('permission assign_permission', this.constructor.name+".del_user_action_map_all");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        data = t.req.body;
        var user_action_model = new baseModel(t.db, 'acl_user_action_map', 'id');
        var conds = [];
        conds['user_id'] = data.user_id;
        //conds['acl_group_id'] = data.acl_group_id;
        user_action_model.findAsync(conds).then(result=>{
            if(Utils.isSet(result) && result.length>0){
                var ids = result.map((v)=>{return v.id})
                user_action_model.deleteAllAsync(ids).then(result=>{
                    t.responeData(result, true, 200, "success");
                })
                .catch(err =>{
                    logger.error(err, this.constructor.name+".del_user_action_map_all");
                    t.responeData(data, false, 1200, "fail");
                })
            }else{
                t.responeData(result, false, 200, "action map is NOT exist");
            }
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".del_user_action_map_all");
            t.responeData(data, false, 1200, "fail");
        })
    }

    /**
     * add/remove all permission actions in group
     */
    change_group_action_map(){
        var data = {};
        var t = this;
        if(!t.hasPermission('assign_permission')){
            logger.error('permission assign_permission', this.constructor.name+".change_group_action_map");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var group_action = t.req.body;
        if(!Utils.isSet(group_action.uid)){
            t.responeData(data, false, 200, "fail data");
            return;
        }
        //AppDebug.log(group_action);
        var user_action_model = new baseModel(t.db, 'acl_user_action_map', 'id');
        if(group_action.on){
            var action_maps = [];
            for(var a in group_action.actions){
                var act = group_action.actions[a];
                action_maps.push({
                    user_id: group_action.uid,
                    acl_action_id: act.id,
                    id: act.map_id
                })
            }
            user_action_model.insertAllAsync(action_maps).then(result=>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err=>{
                logger.error(err, this.constructor.name+".change_group_action_map");
                t.responeData(err, false, 1200, "fail");
            })
        }else{
            var action_maps = [];
            for(var a in group_action.actions){
                var act = group_action.actions[a];
                action_maps.push(act.map_id)
            }
            user_action_model.deleteAllAsync(action_maps).then(result=>{
                t.responeData(data, true, 200, "success");
            })
            .catch(err=>{
                logger.error(err, this.constructor.name+".change_group_action_map");
                t.responeData(data, false, 1200, "fail");
            })
        }
    }
    
    /**
     * QL quyen
     */

    load_all_permission () {
        var data = {};
        var t = this;
        if(!t.hasPermission('permission_management')){
            logger.error('permission permission_management', this.constructor.name+".load_all_permission");
            return t.responeData(data, false, 1005, "Access denined!");
        }

        var acl_group_action_model = new baseModel(t.db, 'acl_group_action', 'id');
        var conds = [];
        conds['acl_group_action.isdeleted'] = 0;
        var order = [];
        order['_datetime'] = 'DESC';

        acl_group_action_model.findAsync(conds, order).then(result=>{
            var groups = result;
            var acl_action_model = new aclActionModel(t.db);
            conds = [];
            conds['acl_action.isdeleted'] = 0;
            order = [];
            order['acl_group_action_id'] = 'ASC';
            // order['acl_type_action_id'] = 'ASC';
            order['_type'] = 'ASC';
            //acl_action_model.selectFields('acl_action.*, acl_group_action.name as gname');
            //acl_action_model.join('acl_group_action', 'acl_action.acl_group_action_id=acl_group_action.id', 'LEFT');
            acl_action_model.findAsync(conds, order).then(result=>{
                ///var groups = {};
                for(var k in result){
                    var act = result[k];
                    for(var g in groups){
                        var group = groups[g];
                        if(!group.actions) group.actions = [];
                        if(group.id == act.acl_group_action_id){
                            group.actions.push(act);
                        }
                    }
                }
    
                t.responeData(groups, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".load_all_permission");
                t.responeData(data, false, 1200, "fail");
            })
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".load_all_permission");
            t.responeData(data, false, 1200, "fail");
        })
    }

    delete_action(){
        var data = {};
        var t = this;
        if(!t.hasPermission('permission_management')){
            logger.error('permission permission_management', this.constructor.name+".delete_action");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var action = t.req.body;
        if(!action || !action.id || !action.url){
            logger.error('error data request', this.constructor.name+".delete_action");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var acl_action_model = new aclActionModel(t.db);
        action.isdeleted = 1;
        var conds = []
        conds['url'] = action.url;
        acl_action_model.updateAsync(action,conds).then(result =>{
            t.responeData(result, true, 200, "success");
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".delete_action");
            t.responeData(data, false, 300, "Không thể xóa action");
        })
    }

    update_action(){
        var data = {};
        var t = this;
        if(!t.hasPermission('permission_management')){
            logger.error('permission permission_management', this.constructor.name+".update_action");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var action = t.req.body;
        if(!action || !action.id || !action.url){
            logger.error('error data request', this.constructor.name+".update_action");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var acl_action_model = new aclActionModel(t.db);
        var conds = []
        //conds['url'] = action.url;
        acl_action_model.updateAsync(action,conds).then(result =>{
            t.responeData(result, true, 200, "success");
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".update_action");
            t.responeData(data, false, 300, "Không thể update action");
        })
    }

    add_action(){
        var data = {};
        var t = this;
        if(!t.hasPermission('permission_management')){
            logger.error('permission permission_management', this.constructor.name+".add_action");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var action = t.req.body;
        if(!action || !action.name || !action.url){
            logger.error('error data request', this.constructor.name+".add_action");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        action._order = action._order? action._order:1;
        var acl_group_action_model = new baseModel(t.db, 'acl_group_action', 'id');
        var conds = [];
        conds['id'] = action.acl_group_action_id;
        acl_group_action_model.firstAsync(conds).then(result=>{
            var acl_action_model = new aclActionModel(t.db);
            // check url exist
            var conds = {
                url: action.url
            }
            acl_action_model.findAsync(conds).then(result =>{
                if(result && result.length>0){
                    t.responeData(result, false, 300, "Quyền đã tồn tại");
                }else{
                    acl_action_model.insertAsync(action).then(result =>{
                        t.responeData(result, true, 200, "success");
                    })
                    .catch(err =>{
                        logger.error(err, this.constructor.name+".add_action");
                        t.responeData(data, false, 300, "Không thể add action");
                    })
                }
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".add_action");
                t.responeData(data, false, 300, "Không thể add action");
            })
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".add_action");
            t.responeData(data, false, 300, "Không tồn tại group action");
        })
    }

    delete_group(){
        var data = {};
        var t = this;
        if(!t.hasPermission('permission_management')){
            logger.error('permission permission_management', this.constructor.name+".delete_group");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var group = t.req.body;
        if(!group || !group.id || !group.name){
            logger.error('error data request', this.constructor.name+".delete_group");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var acl_action_model = new aclActionModel(t.db);
        var conds = []
        conds['acl_group_action_id'] = group.id;
        conds['isdeleted'] = 0;
        acl_action_model.findAsync(conds).then(result =>{
            if(result.length>0){
                t.responeData(data, false, 300, "Không thể xóa group còn chứa action");
            }else{
                var acl_group_action_model = new baseModel(t.db, 'acl_group_action', 'id');
                group.isdeleted = 1;
                acl_group_action_model.deleteAsync(group.id).then(result =>{
                // acl_group_action_model.updateAsync(group, []).then(result =>{
                    t.responeData(result, true, 200, "success");
                })
                .catch(err =>{
                    logger.error(err, this.constructor.name+".delete_action");
                    t.responeData(data, false, 300, "Không thể xóa group");
                })
            }
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".delete_action");
            t.responeData(data, false, 300, "Không thể xóa group");
        })
    }

    add_group(){
        var data = {};
        var t = this;
        if(!t.hasPermission('permission_management')){
            logger.error('permission permission_management', this.constructor.name+".add_group");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var group = t.req.body;
        if(!group || !group.id || !group.name || !group.act_type_id){
            logger.error('error data request', this.constructor.name+".add_group");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var acl_group_action_model = new baseModel(t.db, 'acl_group_action', 'id');
        // database validate
        var conds = {
            "OR":{
                "id": group.id
                ,"name": group.name
            }
        }
        acl_group_action_model.findAsync(conds).then(result =>{
            if(result && result.length>0){
                // group is exist
                if(result.length==1 && result[0].isdeleted==1){
                    // over-write
                    group._datetime = new Date();
                    group.isdeleted = 0;
                    acl_group_action_model.updateAsync(group,[]).then(result =>{
                        t.responeData(result, true, 200, "success");
                    })
                    .catch(err =>{
                        logger.error(err, this.constructor.name+".add_group");
                        t.responeData(data, false, 300, "Không thể Thêm group");
                    })
                }else{
                    t.responeData(data, false, 300, "Group đã tồn tại");
                }
            }else{
                group._datetime = new Date();
                acl_group_action_model.insertAsync(group).then(result =>{
                    t.responeData(result, true, 200, "success");
                })
                .catch(err =>{
                    logger.error(err, this.constructor.name+".add_group");
                    t.responeData(data, false, 300, "Không thể Thêm group");
                })
            }
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".add_group");
            t.responeData(data, false, 300, "Không thể Thêm group");
        })
    }
    update_group(){
        var data = {};
        var t = this;
        if(!t.hasPermission('permission_management')){
            logger.error('permission permission_management', this.constructor.name+".update_group");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var group = t.req.body;
        if(!group || !group.id || !group.name){
            logger.error('error data request', this.constructor.name+".update_group");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var acl_group_action_model = new baseModel(t.db, 'acl_group_action', 'id');
        
        group._datetime = new Date();
        acl_group_action_model.updateAsync(group,[]).then(result =>{
            t.responeData(result, true, 200, "success");
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".update_group");
            t.responeData(data, false, 300, "Không thể update group");
        })
    }
}