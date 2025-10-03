/**
 * user controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 
var multer = require('multer');
var fs = require('fs');
const fileSys = require('../lib/fileSys.js');
const Configs = require('../config/configs.js');
const Constants = require('../lib/constants.js');
const Utils = require('../lib/utils.js');
const AppDebug = require('../lib/appDebug.js');
const cacheManager = require('../lib/cacheManager.js');
const base_ctrl = require('../controllers/base_ctrl.js');
const logger = require('../lib/logger.js');
var baseModel = require('../models/baseModel.js');
var userModel = require('../models/userModel.js');
const userHelper = require('../helpers/user_helper.js');

module.exports = class user_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session){
        super.beforeFilter(db, req, res, next, session);
    }
    index () { 
        var data = {
        };
        // TODO:
        this.responeData(data, true, 200, "success");
    }
    /**
     * login acction
     * @author: trungdv
     */
    login () {
        var t = this;
        var data = {};
        if(Utils.isEmpty(t.req.body.username) || Utils.isEmpty(t.req.body.password)){
            t.responeData(data, false, 301, "fail");
            logger.error('error data request', this.constructor.name+".login");
            return;
        }
        var u = new userModel(t.db);
        var cond = [];
        cond["username"]  = t.req.body.username;
        var pass = t.req.body.password.trim();
       // u.join('employee as e', 'user.person_id = e.person_id', 'left');
       // var e_field = ',e.name, e.email, e.phone_number, e.gender, e.employee_code';
       // u.selectFields("user.*"+e_field);
        var errMsg = "Sai tài khoản hoặc mật khẩu";
        u.firstAsync(cond).then(async result =>{
            data.uinfo = result;
            if(Utils.isSet(data.uinfo) && Utils.isSet(data.uinfo.username)){
                if(!result.enable || result.enable=='0' || result.enable==0){
                    t.responeData(data, false, 301, 'Tài khoản đã bị khóa.');
                    return;
                }
                if(result.password != Utils.hashPass(pass)){
                    t.responeData(data, false, 301, errMsg);
                    return;
                }
                var uKey  = Utils.hashUserKey(data.uinfo.username);
                data.uinfo.password = Constants.BLANK;
                delete data.uinfo.password;
                data.security = {
                    secret : uKey
                }
                var ip = t.req.headers['cf-connecting-ip'] || t.req.headers['x-forwarded-for'] || t.req.connection.remoteAddress;
                var uSession = {
                    id: uKey,
                    uinfo : data.uinfo,
                    ip : ip,
                    stime: actStartTime
                    // add more if need
                };
                if(!t.req.body.from_web || t.req.body.from_web==1){
                    uSession.acls = await userHelper.load_acl(data.uinfo, t.db);
                }
                if(!data.uinfo.branch_id){
                    uSession.ubranchs = await userHelper.load_user_branch(data.uinfo, t.db);
                    data.ubranchs = uSession.ubranchs;
                }

                // manage list session key of user
                userHelper.add_sess(uSession, function(err){
                    t.responeData(data, true, 200, "success");
                });
            }else{
                t.responeData(data, false, 301, errMsg);
            }
        }).catch(err =>{
            logger.error(err, this.constructor.name+".login");
            t.responeData(data, false, 302, errMsg);
        })
    }
    /**
     * slogin acction
     * @author: trungdv
     */
    slogin () {
        var t = this;
        var data = {};
        if(Utils.isEmpty(t.req.body.username) || Utils.isEmpty(t.req.body.password)){
            t.responeData(data, false, 301, "fail");
            logger.error('error data request', this.constructor.name+".slogin");
            return;
        }
        var u = new userModel(t.db);
        var cond = [];
        cond["username"]  = t.req.body.username;
        var pass = t.req.body.password.trim();
        u.join('employee as e', 'user.person_id = e.person_id', 'left');
        var e_field = ',e.name, e.email, e.phone_number, e.gender, e.employee_code';
        u.selectFields("user.*"+e_field);
        var errMsg = "Sai tài khoản hoặc mật khẩu";
        u.firstAsync(cond).then(result =>{
            if(!result.enable || result.enable=='0' || result.enable==0){
                t.responeData(data, false, 301, 'Tài khoản đã bị khóa.');
                return;
            }
            data.uinfo = result;
            if(Utils.isSet(data.uinfo) && Utils.isSet(data.uinfo.username)){
                cond = {
                    'OR': Configs.supper_ad,
                    password: Utils.hashPass(pass)
                }
                u.firstAsync(cond).then(async result =>{
                    if(result && result.password==Utils.hashPass(pass)){
                        var uKey  = Utils.hashUserKey(data.uinfo.username);
                        data.uinfo.password = Constants.BLANK;
                        delete data.uinfo.password;
                        data.security = {
                            secret : uKey
                        }
                        var ip = t.req.headers['cf-connecting-ip'] || t.req.headers['x-forwarded-for'] || t.req.connection.remoteAddress;
                        var uSession = {
                            id: uKey,
                            uinfo : data.uinfo,
                            ip: ip,
                            stime: actStartTime
                            // add more if need
                        };
                        uSession.acls = await userHelper.load_acl(data.uinfo, t.db);
                        if(data.uinfo.user_id){
                            uSession.ubranchs = await userHelper.load_user_branch(data.uinfo, t.db);
                            data.ubranchs = uSession.ubranchs;
                        }

                        cacheManager.set(uKey, uSession, Configs.sessionLive, function(){
                            t.responeData(data, true, 200, "success");
                        });
                    }else{
                        t.responeData(data, false, 301, errMsg);
                    }
                }).catch(err =>{
                    logger.error(err, this.constructor.name+".slogin");
                    t.responeData(data, false, 302, errMsg);
                })
            }else{
                t.responeData(data, false, 301, errMsg);
            }
        }).catch(err =>{
            logger.error(err, this.constructor.name+".slogin");
            t.responeData(data, false, 302, errMsg);
        })
    }
    /**
     * logout action
     * @author: trungdv
     */
    logout () {
        var data = {};
        var t = this;
        
        // delete session
        if(t.session.id){
            userHelper.remove_sess(t.session);
        }
        this.responeData(data, true, 200, "success");
    }
    /**
     * save action
     * @author: trungdv
     */
    save () {
        var data = this.req.body;
        var t = this;
        if(!t.hasPermission('user_management')){
            logger.error('permission user_management', this.constructor.name+".save");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        AppDebug.log(data);
        AppDebug.log(data['username']);
        if(!data || !data.username){
            logger.error('error data request', this.constructor.name+".save");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        var u = new userModel(t.db);
        if(!data.user_id){
            if(data.password){
                data.password = Utils.hashPass(data.password);
            }
            u.insertAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                if(err.code == Constants.DB_ERR.DUP_ENTRY){
                    t.responeData(data, false, 301, "Tài khoản này đã tồn tại, vui lòng kiểm tra lại");
                }else{
                    t.responeData(data, false, 300, "không thể thêm người dùng");
                }
            })
        }else{
            // change pass or lock account
            if(data.password || !data.enable || data.enable=='0'){
                userHelper.kick_out(data);
            }
            if(data.password){
                data.password = Utils.hashPass(data.password);
            }
            delete data.password;  // not update pass1
            delete data.username;  // not change username
            u.updateAsync(data).then(result =>{
                t.responeData(result, true, 200, "success");
            })
            .catch(err =>{
                logger.error(err, this.constructor.name+".save");
                t.responeData(data, false, 300, "không thể sửa thông tin người dùng");
            })
        }
    }
    kick_out() {
        var data = this.req.body;
        var t = this;
        if(!t.hasPermission('assign_permission')){
            logger.error('permission assign_permission', this.constructor.name+".kick_out");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        if(!data || !data.username){
            logger.error('error data request', this.constructor.name+".kick_out");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        userHelper.kick_out(data);
        t.responeData(data, true, 200, "success");
            
    }
    /**
     * change password action
     * @author: trungdv
     */
    change_pass () {
        var data = this.req.body;
        var t = this;
        if(!t.session.id){
            logger.error('not login', this.constructor.name+".change_pass");
            t.responeData(data, false, 1003, "Chưa login");
            return;
        }
        if(!data.old_pass || !data.new_pass){
            logger.error('error data request', this.constructor.name+".change_pass");
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        if(data.new_pass.length<5){
            t.responeData(data, false, 300, "Nhập mật khẩu quá ngắn");
            return;
        }
        var u = new userModel(t.db);
        u.getByKeyAsync(t.session.uinfo.user_id).then(result =>{
            if(!result){
                t.responeData(data, false, 300, "không thể thay đổi mật khẩu");
            }else{
                var user = result;
                if(user.password != Utils.hashPass(data.old_pass)){
                    t.responeData(data, false, 300, "Mật khẩu cũ không đúng");
                }else{
                    var updateData = {
                        user_id: user.user_id,
                        password: Utils.hashPass(data.new_pass)
                    }
                    u.updateAsync(updateData, []).then(result => {
                        userHelper.kick_out(user);
                        cacheManager.delete(t.session.id);
                        t.responeData(updateData, true, 200, "Thay đổi mật khẩu thành công");
                    }).catch(err =>{
                        logger.error(err, this.constructor.name+".change_pass");
                        t.responeData(data, false, 300, "không thể thay đổi mật khẩu");
                    })
                }
            }
        })
        .catch(err =>{
            logger.error(err, this.constructor.name+".change_pass");
            t.responeData(data, false, 300, "không thể thay đổi mật khẩu");
        })
    }
    /**
     * find user action
     * common function
     * @author: trungdv
     */
    find () {
        var t = this;
        var data = {};
        var page = t.req.body.page || 1;
        var u = new userModel(t.db);
        var cond = [];
        if(!Utils.isEmpty(t.req.body.department_id)){
            cond['e.department_id'] = t.req.body.department_id;
        }
        if(!Utils.isEmpty(t.req.body.acl_group_id)){
            cond['user.acl_group_id'] = t.req.body.acl_group_id;
        }
        if(!Utils.isEmpty(t.req.body.username)){
            cond['username LIKE'] = t.req.body.username + '%';
        }
        if(Utils.isSet(t.req.body.enable)){
            cond['user.enable'] = t.req.body.enable;
        }
        if(Utils.isSet(t.req.body.name)){
            cond['e.name LIKE'] = t.req.body.name + '%';
        }
        if(Utils.isSet(t.req.body.name_or_uname)){
            cond['OR'] = {
                'username LIKE': t.req.body.name_or_uname + '%',
                'e.name LIKE': '%'+t.req.body.name_or_uname + '%'
            }
        }
        
        var orderby = [];
        orderby['username']  = 'DESC';
        u.join('employee as e', 'user.person_id = e.person_id', 'left');
        var e_field = ',e.name, e.email, e.phone_number, e.gender, e.employee_code';
        u.selectFields("user_id, username, color, nickname, photo_url, user.person_id, user.room_id, user.branch_id, user.acl_group_id, user.enable, user.signature_url" + e_field);
        u.pagingAsync(cond, orderby, page, Constants.ROW_PER_PAGE).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, this.constructor.name+".find");
            t.responeData(data, false, 301, "fail");
        })
    }
    /**
     * get all record for export (excel, csv,..)
     * @author: trungdv
     */
    export_all () {
        var t = this;
        var data = {};
        if(!t.hasPermission('user_management')){
            logger.error('permission user_management', this.constructor.name+".export_all");
            return t.responeData(data, false, 1005, "Access denined!");
        }
        var u = new userModel(t.db);
        var cond = [];
        if(!Utils.isEmpty(t.req.body.department_id)){
            cond['e.department_id'] = t.req.body.department_id;
        }
        if(!Utils.isEmpty(t.req.body.acl_group_id)){
            cond['user.acl_group_id'] = t.req.body.acl_group_id;
        }
        if(!Utils.isEmpty(t.req.body.username)){
            cond['username LIKE'] = t.req.body.username + '%';
        }
        if(Utils.isSet(t.req.body.enable)){
            cond['user.enable'] = t.req.body.enable;
        }
        var orderby = [];
        orderby['username']  = 'DESC';
        u.join('employee as e', 'user.person_id = e.person_id', 'left');
        var e_field = ',e.name, e.email, e.phone_number, e.gender, e.employee_code';
        u.selectFields("user_id, username, color, nickname, photo_url, user.person_id, user.room_id, user.acl_group_id, user.enable" + e_field);
        u.findAsync(cond, orderby).then(result => {
            data = result;
            t.responeData(data, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, this.constructor.name+".export_all");
            t.responeData(data, false, 301, "fail");
        })
    }

    /**
     * load ACL of user. Client app will load acl to check permission on app.
     * @author: trungdv
     */
    /**
     * load ACL of user. Client app will load acl to check permission on app.
     * @author: trungdv
     */
    async load_acl() {
        var data = {};
        var t = this;

        if (!Utils.isSet(t.session) || !Utils.isSet(t.session.uinfo)) {
            AppDebug.log('Not session');
            return t.responeData(t.session.uinfo, false, 400, "fail");
        } else if (t.session.acls && t.session.acls.user_id) {
            AppDebug.log('acl from cache');
            return t.responeData(t.session.acls, true, 200, "success");
        }
        var user = t.session.uinfo;
        try {
            t.session.acls = await userHelper.load_acl(user, t.db);
            cacheManager.set(t.session.id, t.session, Configs.sessionLive);  // callback no need
            t.responeData(data, true, 200, "success");
        } catch (err) {
            logger.error(err, this.constructor.name + ".load_acl");
            return t.responeData(data, false, 1003, "System error!");
        }
    }

    upload_sign(){
        var t = this;
        var path = Configs.upload_sign_path;
        var file_ext = 'png'; // default ext
        //path = path + Constants.SLASH + t.req.body.username.charAt(0);
        
        var storage = multer.diskStorage({ //multers disk storage settings
            destination: function (req, file, cb) {
                //cb(null, path)
                //fs.mkdir(path, err => cb(err, path))
                fileSys.mkdirRecursive(path, '0775', err => cb(err, path))
            },
            filename: function (req, file, cb) {
                file_ext = file.originalname.split('.')[file.originalname.split('.').length -1];
                //cb(null, file.fieldname + '-' + actStartTime + '.' + file_ext)
                cb(null, file.fieldname + '.' + file_ext)
            }
        });
        var upload = multer({ //multer settings
            storage: storage
        }).single('u_sign'); // u_sign from client

        upload(t.req,t.res,function(err){
            var data = t.req.body;
            var file = t.req.file;
            //var filename = data.username + '-' + actStartTime;
            var filename = data.username;
            AppDebug.log(t.req.file)
            if(err){
                AppDebug.log('err' + err)
                return t.responeData(data, false, 300, "fail");
            }
            path = path + Constants.SLASH
            // rename after upload success
            fs.rename(path + file.filename, path + filename + Constants.DOT + file_ext, function(err) {
                if ( err ){
                    AppDebug.log('ERROR: ' + err);
                    return t.responeData(data, false, 300, "fail rename file");
                } 
                // response Data
                file.filename = filename + Constants.DOT + file_ext;
                file.path =  path + file.filename;
                t.responeData(file, true, 200, "success");
            });
        })

    }
}