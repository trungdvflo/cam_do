/**
 * Created by TrungDV 25/12/2017.
 */
var Utils = class Utils {
    /**
     * $mdDialog
     * confirm = {
     *       title: "Xác nhận xóa quyền",
     *       content: $sce.trustAsHtml('Bạn có chắc chắn xóa quyền <b>'+action.name+'</b>?'),
     *       targetEvent: ev, // event cua button nguon
     *       cancelText: "BỎ QUA",
     *       okText: "ĐỒNG Ý"   // Neu ko co okText thi no giong nhu alert
     *   }
     */
    static confirm($mdDialog, conf) {
        var ev = conf.targetEvent | document.body;
        return $mdDialog.show({
            locals: {
                conf: conf
            },
            controller: function ($scope, conf) {
                $scope.confirm = conf
                var answer = false
                $scope.hideFn = function () {
                    $mdDialog.hide(answer);
                };
                $scope.cancelFn = function () {
                    $mdDialog.hide(answer);
                };
                $scope.okFn = function () {
                    answer = true
                    $mdDialog.hide(answer);
                }
            },
            templateUrl: 'views/components/confirm_dialog.html',
            parent: angular.element(ev),
            clickOutsideToClose: false,
            fullscreen: false
        });
    }
    static printDiv(divName) {
        var printContents = document.querySelector(divName).outerHTML;

        Utils.printContent(printContents);
    }

    static printContent(con) {
        var docHead = document.head.outerHTML;

        var winAttr = "location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=600, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes";
        var newWin = window.open("", "_blank", winAttr);
        var beforePrint = function () {
            //alert('Functionality to run before printing.');
        };
        var afterPrint = function () {
            //alert('Functionality to run after printing');
            //newWin.close();
        };
        if (newWin.matchMedia) {
            var mediaQueryList = newWin.matchMedia('print');
            mediaQueryList.addListener(function (mql) {
                if (mql.matches) {
                    beforePrint();
                } else {
                    afterPrint();
                }
            });
        }
        newWin.onbeforeprint = beforePrint;
        newWin.onafterprint = afterPrint;

        var writeDoc = newWin.document;
        writeDoc.open();
        writeDoc.write('<!doctype html><html>' + docHead + '<body onLoad="window.print()" style="background-color: white;">' + con + '</body></html>');
        writeDoc.close();
        newWin.focus();
    }
    static viewContent(con) {
        var docHead = document.head.outerHTML;

        var winAttr = "location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=600, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes";
        var newWin = window.open("", "_blank", winAttr);

        var writeDoc = newWin.document;
        writeDoc.open();
        writeDoc.write('<!doctype html><html>' + docHead + '<body>' + con + '</body></html>');
        writeDoc.close();
        newWin.focus();
    }

    static downloadClkTrigger($rootScope, $scope, list, $timeout, bid = 'download-as-excel') {
        var waiting = list.length + 1000;
        $timeout(downloadClk, waiting);

        function downloadClk() {
            if ($rootScope.canDownload) {
                $scope.$apply();
                document.getElementById(bid).click();
                // $rootScope.canDownload = false;
            } else {
                $timeout(downloadClk, 500);
            }
        }
    }
    static printClkTrigger($rootScope, $scope, list, $timeout, bid = 'print_template_1') {
        var waiting = 500;
        $timeout(printClk, waiting);

        function printClk() {
            $scope.$apply();
            document.getElementById(bid).click();
        }
    }

    static printClkTrigger_slow($rootScope, $scope, list, $timeout, bid = 'print_template_1') {
        var waiting = 1000;
        $timeout(printClk, waiting);

        function printClk() {
            $scope.$apply();
            document.getElementById(bid).click();
        }
    }

    static pagingCalculator(paging) {
        paging.total_page = parseInt((paging.total_record - 1) / paging.row_per_page) + 1;
        paging.pages = [];
        var start_p = (paging.current_page > 3) ? (paging.current_page - 3) : 1;
        var end_p = (paging.current_page + 3 < paging.total_page) ? (paging.current_page + 3) : paging.total_page;
        for (let i = start_p; i <= end_p; i++) {
            paging.pages.push(i);
        }
        if (paging.total_record >= Constants.PAGING_LIMIT) {
            paging.isTooLarge = true;
        }
        return paging;
    }

    static convertArray(src_arr) {
        var len = src_arr.length;
        var new_arr = [];
        for (let i = 0; i < len; i++) {
            new_arr[src_arr[i].id] = src_arr[i].name;
        }
        return new_arr;
    }
    static convertArray_status(src_arr) {
        var len = src_arr.length;
        var new_arr = [];
        for (let i = 0; i < len; i++) {
            new_arr[src_arr[i].id] = src_arr[i].status;
        }
        return new_arr;
    }
    static convertArray_key(src_arr) {
        var len = src_arr.length;
        var new_arr = [];
        for (let i = 0; i < len; i++) {
            new_arr[src_arr[i].id] = src_arr[i].key;
        }
        return new_arr;
    }

    static onlyLettersAndDigits(str) {
        return str.match("^[a-zA-Z0-9]+$");
    }

    static removeMultiSpace(str) {
        return (str) ? str.replace(/\s\s+/g, ' ') : str;
    }

    static removeMultiSpaceAndTrim(str) {
        return (str) ? str.replace(/\s\s+/g, ' ').trim() : str;
    }

    static convertVietnameseToViEn(content) {
        var str = content;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/ẽ/g, "e");
        str = str.replace(/ị/g, "i");
        str = str.replace(/ủ/g, "u");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");
        str = str.trim();
        return str;
    }

    static checkdate(str_date) {
        var timestamp = Date.parse(str_date);
        if (isNaN(timestamp) == false) {
            return true;
        }
        return false;
    }

}
var AppDebug = class AppDebug {
    static log(...args) {
        if (Configs.debug) {
            //console.log(obj);
            for (let i = 0; i < args.length; i++) {
                console.log(args[i]);
            }
        }
    }
}
var mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function dochangchuc(so, daydu) {
    var chuoi = "";
    chuc = Math.floor(so / 10);
    donvi = so % 10;
    if (chuc > 1) {
        chuoi = " " + mangso[chuc] + " mươi";
        if (donvi == 1) {
            chuoi += " mốt";
        }
    } else if (chuc == 1) {
        chuoi = " mười";
        if (donvi == 1) {
            chuoi += " một";
        }
    } else if (daydu && donvi > 0) {
        chuoi = " lẻ";
    }
    if (donvi == 5 && chuc > 1) {
        chuoi += " lăm";
    } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
        chuoi += " " + mangso[donvi];
    }
    return chuoi;
}

function docblock(so, daydu) {
    var chuoi = "";
    tram = Math.floor(so / 100);
    so = so % 100;
    if (daydu || tram > 0) {
        chuoi = " " + mangso[tram] + " trăm";
        chuoi += dochangchuc(so, true);
    } else {
        chuoi = dochangchuc(so, false);
    }
    return chuoi;
}

function dochangtrieu(so, daydu) {
    var chuoi = "";
    trieu = Math.floor(so / 1000000);
    so = so % 1000000;
    if (trieu > 0) {
        chuoi = docblock(trieu, daydu) + " triệu";
        daydu = true;
    }
    nghin = Math.floor(so / 1000);
    so = so % 1000;
    if (nghin > 0) {
        chuoi += docblock(nghin, daydu) + " nghìn";
        daydu = true;
    }
    if (so > 0) {
        chuoi += docblock(so, daydu);
    }
    return chuoi;
}

function docso(so) {

    if (so == 0) return mangso[0];
    var chuoi = "",
        hauto = "";
    var num = Math.ceil(so); // làm tròn lên
    do {
        ty = num % 1000000000;
        num = Math.floor(num / 1000000000);
        if (num > 0) {
            chuoi = dochangtrieu(ty, true) + hauto + chuoi;
        } else {
            chuoi = dochangtrieu(ty, false) + hauto + chuoi;
        }
        hauto = " tỷ";
    } while (num > 0);
    return jsUcfirst(chuoi.trim() + " đồng");
}
// check validate of date time
function checkDateValid(str_date) {
    var timestamp = Date.parse(str_date);
    if (isNaN(timestamp) == false) {
        return true;
    }
    return false;
}

/**
 * convert datetime
 * @param {*} input 
 */
function dateConvert(input) {
    var full_date = ''
    if (typeof input == 'string') {
        var date = input.split('/');
        full_date = date[0] + "/" + date[1] + "/" + date[2];
    } else if (typeof input == 'object') {
        var dateObj = new Date(input);
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        full_date = day + "/" + month + "/" + year;
    }
    return full_date;
}

function uniq(a) {
    return Array.from(new Set(a));
}

function formatNumber(n, c, d, t) {
    if (!n) return n;
    c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function formatNumber2(n, c, d, t) {
    if (!n) return n;
    var cd = (String(n).indexOf(d) >= 0) ? d : ""
    var p = ""
    if (cd === d) {
        p = String(n).split(d)[1];
    }
    c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    var res = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ((Math.abs(n - i) > 0) ? d + p : cd)
    //console.log('res', res)
    return res;
};

function getByteLength(contents) {
    if (typeof Buffer !== 'undefined') {
        return Buffer.byteLength(contents, 'utf8')
    }
    return encodeURIComponent(contents).replace(/%[A-F\d]{2}/g, 'U').length
}

/**
 * Check string have digital character
 * @author: khanh / @internet
 */
function hasNumber(myString) {
    return /\d/.test(myString);
}

///////////////////////////////////CONSTANTS////////////////////////////////////
var Constants = {
    DISABLED: 1,
    NOT_DISABLED: 0,
    UNLOCK: 0,
    BLOCK: 1,

    N_ZERRO: 0,
    N_ONE: 1,
    N_TWO: 2,
    N_THREE: 3,

    // paging
    ROW_PER_PAGE: 15,
    PAGING_LIMIT: 500,

    BEFORE: 'before',
    AFTER: 'after',

    //enum_status trong bảng xuất kho
    NOT_SEND: 0, //chưa được gửi
    WAITING: 1, //đã gửi, đợi xử lý
    ACCEPTED: 2, //đồng ý
    REFUSE: 3, //từ chối


}

var VAT = [{
        id: 0,
        name: '0'
    },
    {
        id: 5,
        name: '5'
    },
    {
        id: 10,
        name: '10'
    },
];

var ENUM_CONST = {
    CONTRACT_TYPES: [{
            name: "Biên chế",
            id: 'inside_fund'
        },
        {
            name: "Hợp đồng",
            id: 'outside_fund'
        }
    ],
};

const MONEY_IN_TYPE = {
    tra_do: 0,
    gia_han: 1,
    thanh_ly: 2,
    von: 3,
    tra_gop: 4, // gia han + von
}

const MONEY_OUT_TYPE = {
    cam_do: 0,
    tien_nha: 1,
    rut_quy: 2,
    khac: -1,
}

const MONEY_OUT_STATUS = {
    chua_tra: 0,
    da_tra: 1,
    gia_han: 2,
    thanh_ly: 3,
}

const SALARY_STATUS = {
    NOT_PAY_YES: 0,
    PAYED: 1,
}