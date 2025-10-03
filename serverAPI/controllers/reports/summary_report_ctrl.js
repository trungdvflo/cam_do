/**
 * user controller.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */

const Constants = require('../../lib/constants.js');
const Utils = require('../../lib/utils.js');
const AppDebug = require('../../lib/appDebug.js');
const cacheManager = require('../../lib/cacheManager.js');
const base_ctrl = require('../base_ctrl.js');
const logger = require('../../lib/logger.js');
var baseModel = require('../../models/baseModel.js');
var money_outModel = require('../../models/money_outModel.js');
var money_inModel = require('../../models/money_inModel.js');
var salaryModel = require('../../models/salaryModel.js');

module.exports = class summary_report_ctrl extends base_ctrl {
    beforeFilter(db, req, res, next, session) {
        super.beforeFilter(db, req, res, next, session);
    }
    index() {
        var data = {};
        // TODO:
        this.responeData(data, true, 200, "success");
    }
    
    /**
     * find get_balance action
     * @author: trungdv 
     */
    async get_balance() {
      var t = this;
      var data = t.req.body;
      if (!t.hasPermission('report_summary')) {
          logger.error('permission report_summary', t.req.path);
          return t.responeData(data, false, 1005, "Access denined!");
      }
      var res = {};
      try{
        var mi = new money_inModel(t.db);
        var cond = [];
        if (data.branch_id>0) {
            cond['money_in.branch_id'] = data.branch_id;
        }
        if (data.from) {
            cond['money_in.ngay_tra >='] = Utils.formatMySQL(data.from, true);
        }
        if (data.to) {
            cond['money_in.ngay_tra <='] = Utils.formatMySQL(data.to, true);
        }
        cond['type'] = Constants.MONEY_IN_TYPE.von;
        mi.selectFields('SUM(`tien_tra`) tien_tra');
        const von = await mi.findAsync(cond);
        res.von = von[0].tien_tra;

        cond = [];
        if (data.branch_id>0) {
            cond['money_in.branch_id'] = data.branch_id;
        }
        cond['OR'] = {
          'type': Constants.MONEY_IN_TYPE.tra_do,
          'type ': Constants.MONEY_IN_TYPE.gia_han,
          'type  ': Constants.MONEY_IN_TYPE.tra_gop,
          'type   ': Constants.MONEY_IN_TYPE.thanh_ly
        }
        if (data.from) {
            cond['money_in.ngay_tra >='] = Utils.formatMySQL(data.from, true);
        }
        if (data.to) {
            cond['money_in.ngay_tra <='] = Utils.formatMySQL(data.to, true);
        }
        mi.groupBy('type');
        mi.selectFields('SUM(`tien_tra`) tong_tra, SUM(`tien_loi`) tong_loi, type');
        const tras = await mi.findAsync(cond);
        res.tong_tra = 0;
        res.tong_loi = 0;
        res.tra = 0;
        res.tra_loi = 0;
        res.gia_han = 0;
        res.gia_han_loi = 0;
        res.thanh_ly = 0;
        res.thanh_ly_loi = 0;
        for(let tra of tras) {
            res.tong_tra += tra.tong_tra;
            res.tong_loi += tra.tong_loi;
            if(tra.type === Constants.MONEY_IN_TYPE.tra_do){
                res.tra += tra.tong_tra;
                res.tra_loi += tra.tong_loi;
            } else if(tra.type === Constants.MONEY_IN_TYPE.gia_han
            || tra.type === Constants.MONEY_IN_TYPE.tra_gop) { // tra gop tinh gia han
                res.gia_han += tra.tong_tra;
                res.gia_han_loi += tra.tong_loi;
            } else if(tra.type === Constants.MONEY_IN_TYPE.thanh_ly){
                res.thanh_ly += tra.tong_tra;
                res.thanh_ly_loi += tra.tong_loi;
            }
        }

        var mo = new money_outModel(t.db);
        cond = [];
        if (data.branch_id>0) {
            cond['money_out.branch_id'] = data.branch_id;
        }
        if (data.from) {
            cond['money_out.ngay_cam >='] = Utils.formatMySQL(data.from, true);
        }
        if (data.to) {
            cond['money_out.ngay_cam <='] = Utils.formatMySQL(data.to, true);
        }
        cond['type'] = Constants.MONEY_OUT_TYPE.cam_do;
        mo.selectFields('SUM(`tien_vay`) tong_vay');
        const tong_vay = await mo.findAsync(cond);
        res.tong_vay = tong_vay[0].tong_vay;

        cond = [];
        if (data.branch_id>0) {
            cond['money_out.branch_id'] = data.branch_id;
        }
        if (data.from) {
            cond['money_out.ngay_cam >='] = Utils.formatMySQL(data.from, true);
        }
        if (data.to) {
            cond['money_out.ngay_cam <='] = Utils.formatMySQL(data.to, true);
        }
        cond['type'] = Constants.MONEY_OUT_TYPE.rut_quy;
        mo.selectFields('SUM(`tien_vay`) rut_quy');
        const rut_quy = await mo.findAsync(cond);
        res.rut_quy = rut_quy[0].rut_quy;

        cond = [];
        if (data.branch_id>0) {
            cond['money_out.branch_id'] = data.branch_id;
        }
        if (data.from) {
            cond['money_out.ngay_cam >='] = Utils.formatMySQL(data.from, true);
        }
        if (data.to) {
            cond['money_out.ngay_cam <='] = Utils.formatMySQL(data.to, true);
        }
        cond['OR'] = {
          'type': Constants.MONEY_OUT_TYPE.tien_nha,
          'type ': Constants.MONEY_OUT_TYPE.khac,
        }
        mo.selectFields('SUM(`tien_vay`) tong_chi');
        const tong_chi = await mo.findAsync(cond);
        res.tong_chi = tong_chi[0].tong_chi;

        res.loi_nhuan = res.tong_loi - res.tong_chi;

        cond = [];
        if (data.branch_id>0) {
            cond['salary.branch_id'] = data.branch_id;
        }
        if (data.from) {
            cond['salary.balance_date >='] = Utils.formatMySQL(data.from, true);
        }
        if (data.to) {
            cond['salary.balance_date <='] = Utils.formatMySQL(data.to, true);
        }
        const salaryM = new salaryModel(t.db);
        salaryM.selectFields('SUM(`balance`) tong_thu_lao');
        const tong_thu_lao = await salaryM.findAsync(cond);
        res.tong_thu_lao = tong_thu_lao[0].tong_thu_lao;

        t.responeData(res, true, 200, "success");
      }catch(err){
        logger.error(err, t.req.path);
        t.responeData(data, false, 301, "Lỗi tìm kiếm");
      }

    }
}