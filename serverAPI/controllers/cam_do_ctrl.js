/**
 * user controller.
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
const logger = require('../lib/logger.js');
var baseModel = require('../models/baseModel.js');
var money_outModel = require('../models/money_outModel.js');
var money_inModel = require('../models/money_inModel.js');
var report_closedModel = require('../models/report_closedModel.js');

module.exports = class cam_do_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session) {
        super.beforeFilter(db, req, res, next, session);
    }
    index() {
        var data = {};
        // TODO:
        this.responeData(data, true, 200, "success");
    }
    
    /**
     * save action
     * @author: trungdv
     */
    async save_in() {
      var data = this.req.body;
      var t = this;
      if (!t.hasPermission(['quan_ly_quy_edit','cam_do_edit'])) {
          logger.error('permission quan_ly_quy_edit cam_do_edit', t.req.path);
          return t.responeData(data, false, 1005, "Access denined!");
      }
      data.branch_id = t.session.uinfo.branch_id || data.branch_id;
      if (!data || Utils.isEmpty(data.tien_tra) || !data.ngay_tra || !data.branch_id) {
          logger.error('error data request', t.req.path);
          t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
          return;
      }
      if(data.type != Constants.MONEY_IN_TYPE.gia_han.toString() && Number(data.tien_tra) <= 0){
        logger.error('error data request', t.req.path);
        return t.responeData(data, false, 303, "Lỗi nhập tiền trả");
      }
      if(data.type != Constants.MONEY_IN_TYPE.von){
        if(!data.money_out_id || Number(data.money_out_id) <= 0){
          logger.error('error data request', t.req.path);
          return t.responeData(data, false, 302, "Lỗi dữ liệu gởi");
        }
        if(data.tien_loi < 0){
          logger.error('error data request', t.req.path);
          return t.responeData(data, false, 303, "Lỗi nhập tiền lời");
        }
      } else if(data.type == Constants.MONEY_IN_TYPE.von){
        if(data.money_out_id){
          logger.error('error data request', t.req.path);
          return t.responeData(data, false, 304, "Lỗi dữ liệu gởi");
        }
      }
      try{
        var mo = new money_outModel(t.db);
        var mi = new money_inModel(t.db);
        let moUp = null;
        if(!data.id){
          if(Number(data.money_out_id) > 0){
            const money_out = await mo.getByKeyAsync(data.money_out_id);
            if(!money_out || !money_out.id){
              return t.responeData(money_out, false, 304, "Lỗi không tìm thấy vật cầm");
            }
            if(data.type != Constants.MONEY_IN_TYPE.gia_han && data.type != Constants.MONEY_IN_TYPE.tra_gop
             && !data.tien_tra){
              return t.responeData(money_out, false, 305, "Nhập tiền gốc chưa đúng");
            }
            if(money_out.trang_thai == Constants.MONEY_OUT_STATUS.da_tra.toString() || money_out.trang_thai == Constants.MONEY_OUT_STATUS.thanh_ly){
              return t.responeData(money_out, false, 306, "Vật cầm đã trả hoặc thanh lý");
            }
            let out_stauts = [];
            out_stauts[Constants.MONEY_IN_TYPE.tra_do] = Constants.MONEY_OUT_STATUS.da_tra;
            out_stauts[Constants.MONEY_IN_TYPE.thanh_ly] = Constants.MONEY_OUT_STATUS.thanh_ly;
            out_stauts[Constants.MONEY_IN_TYPE.gia_han] = Constants.MONEY_OUT_STATUS.gia_han;
            out_stauts[Constants.MONEY_IN_TYPE.tra_gop] = Constants.MONEY_OUT_STATUS.gia_han;
            moUp = {
              id: money_out.id,
              trang_thai: out_stauts[data.type],
              ngay_gia_han: new Date(),
              status_call: 0,
              note_call: '',
            };
            if(data.type == Constants.MONEY_IN_TYPE.gia_han || data.type == Constants.MONEY_IN_TYPE.tra_gop){
              if(data.ngay_tra_du_tinh){
                moUp.ngay_tra_du_tinh = Utils.formatMySQL(data.ngay_tra_du_tinh);
              }else{
                let tem = new Date();
                tem.setDate(tem.getDate()+14);
                moUp.ngay_tra_du_tinh = tem;
              }
              // Tra gop, da tinh ben phan thu
              // if(data.tien_tra>0) {
              //   moUp.tien_vay = money_out.tien_vay - Number(data.tien_tra);
              // }
            }
          }
          data.created_date = new Date();
          data.ngay_tra = Utils.formatMySQL(data.ngay_tra);
          data.creator = t.session.uinfo.username;
          delete data.ngay_tra_du_tinh;
          mi.insertAsync(data).then(result => {
            if(moUp){
              mo.updateAsync(moUp).then(result2 => {
                t.responeData(result, true, 200, "success");
              }).catch(err => {
                logger.error(err, t.req.path);
                t.responeData(data, false, 307, "không thể insert");
              })
            }else{
              t.responeData(result, true, 200, "success");
            }
          })
          .catch(err => {
              logger.error(err, t.req.path);
              t.responeData(data, false, 300, "không thể insert");
          })          
        }else{
          const cond = [];
          cond['money_out_id'] = data.money_out_id;
          cond['branch_id'] = data.branch_id;
          cond['type'] = data.type;
          cond['tien_tra'] = data.tien_tra;
          cond['is_reported'] = 0;
          data.ngay_tra = Utils.formatMySQL(data.ngay_tra);
          if(data.type == Constants.MONEY_IN_TYPE.gia_han || data.type == Constants.MONEY_IN_TYPE.tra_gop){
            moUp = {
              id: data.money_out_id,
            };
            if(data.ngay_tra_du_tinh){
              moUp.ngay_tra_du_tinh = Utils.formatMySQL(data.ngay_tra_du_tinh);
            }else{
              let tem = new Date();
              tem.setDate(tem.getDate()+14);
              moUp.ngay_tra_du_tinh = tem;
            }
          }
          delete data.ngay_tra_du_tinh;
          mi.updateAsync(data, cond).then(async result => {
            if(moUp.id>0){
              await mo.updateAsync(moUp);
            }
            t.responeData(result, true, 200, "success");
          })
          .catch(err => {
              logger.error(err, t.req.path);
              t.responeData(data, false, 300, "không thể cập nhật");
          })          
        }
      }catch(err){
        logger.error(err, t.req.path);
        t.responeData(data, false, 308, "Lỗi hệ thống");
      }
    }
    /**
     * save action
     * @author: trungdv
     */
    save_out() {
        var data = this.req.body;
        var t = this;
        if (!t.hasPermission(['quan_ly_quy_edit','cam_do_edit'])) {
            logger.error('permission quan_ly_quy_edit cam_do_edit', t.req.path);
            return t.responeData(data, false, 1005, "Access denined!");
        }
        data.branch_id = t.session.uinfo.branch_id || data.branch_id;
        if (!data || !data.tien_vay || !data.ngay_cam || !data.branch_id) {
            logger.error('error data request', t.req.path);
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        if(data.tien_vay <= 0){
          logger.error('error data request', t.req.path);
          return t.responeData(data, false, 303, "Lỗi nhập tiền");
        }
        if (!Utils.isEmpty(data.username)) {
        }
        var mo = new money_outModel(t.db);
        data.created_date = new Date();
        data.ngay_cam = Utils.formatMySQL(data.ngay_cam);
        // if(data.type == Constants.MONEY_OUT_TYPE.cam_do){
        //   data.ngay_tra_du_tinh = Utils.formatMySQL(data.ngay_tra_du_tinh);
        // }
        switch (data.type) {
          case Constants.MONEY_OUT_TYPE.cam_do:
            data.ngay_tra_du_tinh = Utils.formatMySQL(data.ngay_tra_du_tinh);
            break;
          case Constants.MONEY_OUT_TYPE.rut_quy:
            data.vat_cam = 'Rút quỹ';
            break;
          case Constants.MONEY_OUT_TYPE.tien_nha:
            data.vat_cam = 'Tiền nhà';
            break;
          default:
            data.vat_cam = "Chi khác";
        }
        if(!data.id){
          data.creator = t.session.uinfo.username;
          data.trang_thai = 0;
          mo.insertAsync(data).then(result => {
              t.responeData(result, true, 200, "success");
          })
          .catch(err => {
              logger.error(err, t.req.path);
              t.responeData(data, false, 301, "không thể insert");
          })
        }else{
          let conds = [];
          conds['creator'] = t.session.uinfo.username;
          conds['branch_id'] = data.branch_id;
          conds['type'] = data.type;
          conds['is_reported'] = 0;
          mo.updateAsync(data, conds).then(result => {
              t.responeData(result, true, 200, "success");
          })
          .catch(err => {
              logger.error(err, t.req.path);
              t.responeData(data, false, 301, "không thể cập nhật");
          })
        }
    }
    /**
     * save action
     * @author: trungdv
     */
    ghi_chu() {
        var data = this.req.body;
        var t = this;
        if (!t.hasPermission(['quan_ly_quy_edit','cam_do_edit'])) {
            logger.error('permission quan_ly_quy_edit cam_do_edit', t.req.path);
            return t.responeData(data, false, 1005, "Access denined!");
        }
        data.branch_id = t.session.uinfo.branch_id || data.branch_id;
        if (!data || !data.id || !data.ghi_chu) {
            logger.error('error data request', t.req.path);
            t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
            return;
        }
        let conds = [];
        conds['branch_id'] = data.branch_id;
        const upData = {
          id: data.id,
          ghi_chu: data.ghi_chu
        }
        var mo = new money_outModel(t.db);
        mo.updateAsync(upData, conds).then(result => {
            t.responeData(result, true, 200, "success");
        })
        .catch(err => {
            logger.error(err, t.req.path);
            t.responeData(data, false, 301, "không thể cập nhật");
        })
    }

    /**
     * lien_he action
     * @author: trungdv
     */
    lien_he() {
      var data = this.req.body;
      var t = this;
      if (!t.hasPermission(['quan_ly_quy_edit','lien_he_den_han'])) {
          logger.error('permission quan_ly_quy_edit lien_he_den_han', t.req.path);
          return t.responeData(data, false, 1005, "Access denined!");
      }
      data.branch_id = t.session.uinfo.branch_id || data.branch_id;
      if (!data || !data.id || !data.note_call || !data.status_call) {
          logger.error('error data request', t.req.path);
          t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
          return;
      }
      let conds = [];
      conds['branch_id'] = data.branch_id;
      const upData = {
        id: data.id,
        note_call: data.note_call,
        status_call: data.status_call,
      }
      var mo = new money_outModel(t.db);
      mo.updateAsync(upData, conds).then(result => {
          t.responeData(result, true, 200, "success");
      })
      .catch(err => {
          logger.error(err, t.req.path);
          t.responeData(data, false, 301, "không thể cập nhật");
      })
    }
  
    /**
     * find find_out action
     * @author: trungdv
     */
    find_out() {
        var t = this;
        var data = t.req.body;
        if (!t.hasPermission(['quan_ly_quy_view','cam_do_view', 'lien_he_den_han'])) {
            logger.error('permission quan_ly_quy_view cam_do_view lien_he_den_han', t.req.path);
            return t.responeData(data, false, 1005, "Access denined!");
        }
        data.branch_id = t.session.uinfo.branch_id || data.branch_id;
        var mo = new money_outModel(t.db);
        var cond = [];
        var orderby = [];
        if(data.sort) {
          orderby[data.sort] = 'ASC';
        }else{
          orderby['id'] = 'ASC';
        }

        if (data.report_date) {
            cond['money_out.ngay_cam'] = Utils.formatMySQL(data.report_date, true);
        }
        if (data.id>0) {
            cond['money_out.id'] = data.id;
        }
        if (data.branch_id>0) {
            cond['money_out.branch_id'] = data.branch_id;
        }
        if (data.tu_ngay) {
            cond['money_out.ngay_cam >='] = Utils.formatMySQL(data.tu_ngay, true);
        }
        if (data.den_ngay) {
            cond['money_out.ngay_cam <='] = Utils.formatMySQL(data.den_ngay, true);
        }
        if (!Utils.isEmpty(data.trang_thai)) {
          cond['money_out.trang_thai'] = data.trang_thai;
        }
        if (!Utils.isEmpty(data.keyword)) {
          cond['OR '] = {
            'money_out.dien_giai LIKE': data.keyword + '%',
            'money_out.model LIKE': data.keyword + '%',
            'money_out.ma_so LIKE': data.keyword + '%'
          };
        }
        if (data.money_out_open===1) {
          cond['OR'] = {
            'money_out.trang_thai': Constants.MONEY_OUT_STATUS.chua_tra,
            'money_out.trang_thai ': Constants.MONEY_OUT_STATUS.gia_han,
          };
        } else if (data.money_out_open===0) {
          cond['OR'] = {
            'money_out.trang_thai': Constants.MONEY_OUT_STATUS.da_tra,
            'money_out.trang_thai ': Constants.MONEY_OUT_STATUS.thanh_ly,
          };
        }
        if (!Utils.isEmpty(data.type)) {
          cond['money_out.type'] = data.type;
        }
        if (data.is_overdue == 1) {
          cond['money_out.ngay_tra_du_tinh <'] = Utils.formatMySQL(new Date(), true);
        }
        if(data.page){
          mo.pagingAsync(cond, orderby, data.page, Constants.ROW_PER_PAGE).then(result => {
              t.responeData(result, true, 200, "success");
          })
          .catch(err => {
              logger.error(err, t.req.path);
              t.responeData(data, false, 301, "Lỗi tìm kiếm");
          })
        } else {
          mo.findAsync(cond, orderby).then(result => {
              t.responeData(result, true, 200, "success");
          })
          .catch(err => {
              logger.error(err, t.req.path);
              t.responeData(data, false, 301, "Lỗi tìm kiếm");
          })
        }

    }

    /**
     * find find_in action
     * @author: trungdv
     */
    find_in() {
      var t = this;
      var data = t.req.body;
      if (!t.hasPermission(['quan_ly_quy_view','cam_do_view', 'lien_he_den_han'])) {
          logger.error('permission quan_ly_quy_view cam_do_view lien_he_den_han', t.req.path);
          return t.responeData(data, false, 1005, "Access denined!");
      }
      data.branch_id = t.session.uinfo.branch_id || data.branch_id;
      var mi = new money_inModel(t.db);
      var cond = [];
      var orderby = [];
      orderby['money_in.id'] = 'ASC';

      if (data.id>0) {
          cond['money_in.id'] = data.id;
      }
      if (data.branch_id>0) {
          cond['money_in.branch_id'] = data.branch_id;
      }
      if (data.money_out_id>0) {
          cond['money_in.money_out_id'] = data.money_out_id;
      }
      if (data.report_date) {
          cond['money_in.ngay_tra'] = Utils.formatMySQL(data.report_date, true);
      }
      let out_fields = '';
      if(data.join_out){
        mi.join('money_out o', "money_in.money_out_id=o.id", 'left');
        out_fields = ', o.trang_thai, o.ngay_cam, o.vat_cam, o.dien_giai, o.model, o.ma_so, o.nguoi_cam';
      }
      mi.selectFields('money_in.*' + out_fields);
      mi.findAsync(cond, orderby).then(result => {
          t.responeData(result, true, 200, "success");
      })
      .catch(err => {
          logger.error(err, t.req.path);
          t.responeData(data, false, 301, "Lỗi tìm kiếm");
      })

    }
    
    /**
     * find get_balance action
     * @author: trungdv
     */
    get_balance() {
      var t = this;
      var data = t.req.body;
      if (!t.hasPermission(['quan_ly_quy_view','cam_do_view'])) {
        logger.error('permission quan_ly_quy_view cam_do_view', t.req.path);
        return t.responeData(data, false, 1005, "Access denined!");
      }
      data.branch_id = t.session.uinfo.branch_id || data.branch_id;
      var mi = new money_inModel(t.db);
      var cond = [];
      var orderby = [];
      if (data.branch_id>0) {
          cond['money_in.branch_id'] = data.branch_id;
      }
      if (data.report_date) {
          cond['money_in.ngay_tra <='] = Utils.formatMySQL(data.report_date, true);
      }
      mi.selectFields('SUM(`tien_tra`) tien_tra, SUM(`tien_loi`) tien_loi');
      mi.findAsync(cond, orderby).then(result => {
          cond = [];
          var mo = new money_outModel(t.db);
          if (data.branch_id>0) {
              cond['money_out.branch_id'] = data.branch_id;
          }
          if (data.report_date) {
              cond['money_out.ngay_cam <='] = Utils.formatMySQL(data.report_date, true);
          }
          mo.selectFields('SUM(`tien_vay`) tien_vay');
          mo.findAsync(cond, orderby).then(result2 => {
              t.responeData({...result[0], ...result2[0]}, true, 200, "success");
          })
          .catch(err => {
              logger.error(err, t.req.path);
              t.responeData(data, false, 302, "Lỗi tìm kiếm");
          })
      })
      .catch(err => {
          logger.error(err, t.req.path);
          t.responeData(data, false, 301, "Lỗi tìm kiếm");
      })
    }
    /**
     * report_closed action
     * @author: trungdv
     */
    async report_closed() {
      var data = this.req.body;
      var t = this;
      if (!t.hasPermission(['quan_ly_quy_edit','cam_do_edit'])) {
          logger.error('permission quan_ly_quy_edit cam_do_edit', t.req.path);
          return t.responeData(data, false, 1005, "Access denined!");
      }
      data.branch_id = t.session.uinfo.branch_id || data.branch_id;
      if (!data || Utils.isEmpty(data.report_date) || Utils.isEmpty(data.balance) || !data.branch_id) {
          logger.error('error data request', t.req.path);
          t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
          return;
      }
      try{
        let rptModel = new report_closedModel(t.db);
        let conds = [];
        conds['branch_id'] = data.branch_id;
        conds['report_date'] = Utils.formatMySQL(data.report_date, true);
        let rpt = await rptModel.firstAsync(conds);
        if(rpt && rpt.id){
          rpt.money_balance = data.balance;
          rpt.money_in = data.tong_thu;
          rpt.money_out = data.tong_chi;
          await rptModel.updateAsync(rpt,conds);
        }else{
          let dataIns = {
            report_date: Utils.formatMySQL(data.report_date, true),
            money_balance: data.balance,
            money_in: data.tong_thu,
            money_out: data.tong_chi,
            branch_id: data.branch_id,
            created_date: new Date()
          }
          await rptModel.insertAsync(dataIns);
        }
        let dataUp = {
          is_reported: 1
        }
        try{
          conds = [];
          conds['branch_id'] = data.branch_id;
          conds['ngay_cam'] = Utils.formatMySQL(data.report_date, true);
          var mo = new money_outModel(t.db);
          await mo.updateAsync(dataUp, conds);
        }catch(err){
          logger.error(err, t.req.path);
        }
        try{
          conds = [];
          conds['branch_id'] = data.branch_id;
          conds['ngay_tra'] = Utils.formatMySQL(data.report_date, true);
          var mi = new money_inModel(t.db);
          await mi.updateAsync(dataUp, conds);
        }catch(err){
          logger.error(err, t.req.path);
        }
        t.responeData(data, true, 200, "success");
      }catch(err){
        logger.error(err, t.req.path);
        t.responeData(data, false, 301, "không thể gởi báo cáo");
      }
    }
    /**
     * report_closed action
     * @author: trungdv
     */
    get_report_date() {
      var data = this.req.body;
      var t = this;
      if (!t.hasPermission(['quan_ly_quy_view','cam_do_view'])) {
          logger.error('permission quan_ly_quy_view cam_do_view', t.req.path);
          return t.responeData(data, false, 1005, "Access denined!");
      }
      data.branch_id = t.session.uinfo.branch_id || data.branch_id;
      if (!data || Utils.isEmpty(data.report_date) || !data.branch_id ) {
          logger.error('error data request', t.req.path);
          t.responeData(data, false, 300, "Lỗi dữ liệu gởi");
          return;
      }
      try{
        let rptModel = new report_closedModel(t.db);
        let conds = [];
        conds['branch_id'] = data.branch_id;
        conds['report_date'] = Utils.formatMySQL(data.report_date, true);
        rptModel.firstAsync(conds).then(res=>{
          t.responeData(res, true, 200, "success");
        }).catch(err=>{
          logger.error(err, t.req.path);
          t.responeData(data, false, 301, "Lỗi tìm báo cáo");
        })
      }catch(err){
        logger.error(err, t.req.path);
        t.responeData(data, false, 301, "Lỗi tìm báo cáo");
      }
    }
}