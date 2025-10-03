/**
 * Configs.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */ 

var Constants = {
    // session manage
    SESS_UKEYS : 'SESS_UKEYS',

    // String
    DOT         : '.',
    BLANK       : '',
    SPACE       : ' ',
    SLASH       : '/',

    // paging
    ROW_PER_PAGE:   15,
    PAGING_LIMIT:   500,

    // supper admin
    allow_uid: '1',


    // format
    formatLongDate: 'DD/MM/YYYY',
    formatShortDate: 'D/M/YY',

    DISABLED: 1,
    NOT_DISABLED: 0,

    N_ZERRO: 0,
    N_ONE: 1,
    N_TWO: 2,
   
    DB_ERR: {
        DUP_ENTRY: 'ER_DUP_ENTRY'
    },

    MONEY_IN_TYPE : {
        tra_do: 0,
        gia_han: 1,
        thanh_ly: 2,
        von: 3,
        tra_gop: 4,
    },
    MONEY_OUT_TYPE : {
        cam_do: 0,
        tien_nha: 1,
        rut_quy: 2,
        khac: -1,
    },
    MONEY_OUT_STATUS : {
        chua_tra: 0,
        da_tra: 1,
        gia_han: 2,
        thanh_ly: 3,
    },
    SALARY_STATUS: {
        NOT_PAY_YES: 0,
        PAYED: 1,
    }
};

module.exports = Constants;