/**
 * Configs.
 * create 2017/12/25
 * @author trungdv
 * @version $Id$
 * @copyright 2017 MIT
 */
const Constants = require('../lib/constants.js');
var Configs = require('../config/configs.js');
var crypto = require('crypto');

module.exports = class Utils {
    static replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    /**
     * check obj exist or not
     * @param {* obj is checked} obj 
     */
    static isSet(obj) {
        if (typeof obj === 'undefined') {
            return false;
        }
        return true;
    }
    /**
     * emply or null => return true
     * @param {* obj is check} obj 
     */
    static isEmpty(obj) {
        if (obj === Constants.BLANK) {
            return true;
        } else {
            return !Utils.isSet(obj);
        }
    }
    /**
     * ceate check sume vale
     * @param {*string} st 
     * @returns sume value
     */
    static createSum(st) {
        if (Utils.isEmpty(st)) return 0;
        var sum = 0;
        for (var i = 0; i < st.length; i++) {
            sum += st.charCodeAt(i);
        }
        return sum;
    }
    static checkSum(st, csum) {
        if (Utils.isEmpty(st)) return false;
        var sum = 0;
        for (var i = 0; i < st.length; i++) {
            sum += st.charCodeAt(i);
        }
        return (sum == csum);
    }
    /**
     * create hash string for username
     * @param {*} username 
     */
    static hashUserKey(username) {
        var salt = Configs.salt;
        var _time = Date.now();

        var hash = crypto.createHmac('sha256', salt); /** Hashing algorithm sha512 */
        hash.update(username + _time);
        var value = hash.digest('hex');

        return value + '_' + _time + '_' + Utils.createSum(value);
    }
    /**
     * hash password
     * @param {*} password 
     */
    static hashPass(password) {
        var hash = crypto.createHmac('sha256', 'his');
        hash.update(password);
        var value = hash.digest('hex');

        return value;
    }
        
    /**
     * 
     * date : string. Ex: Date.now() || '15/03/2018' || '15-03-2018' || '2018/3/15' || '2018/03/15' || '2018-03-15' || '2018-3-15'
     * onlyDate = tru: return yyyy-MM-dd
     * onlyDate = false: return yyyy-MM-dd H:i:s
     */
    static formatMySQL(date, onlyDate) {
        //if (date && date.length > 0) {
        if (date) {
            if (date.length == 10) {
                //change dd/MM/yyyy -> dd-MM-YYYY -> yyyy-MM-dd
                var sDate = date.replace(/\//g, "-");
                var sDateArr = sDate.split('-');
                if (sDateArr[0].length == 2) {
                    date = sDateArr[2] + '-' + sDateArr[1] + '-' + sDateArr[0];
                }
                var d = new Date();
                date = date + ' ' + Utils.twoDigits(d.getHours()) + ':' + Utils.twoDigits(d.getMinutes() + ':' + Utils.twoDigits(d.getSeconds()));
            }

            var currentUtcTime = new Date(date);
            var d = new Date(currentUtcTime.toLocaleString('en-US', {
                timeZone: 'Asia/Ho_Chi_Minh'
            }));
            /*var dateArr = d.toLocaleDateString().split('-');
            var year = dateArr[0];
            var month = Utils.twoDigits(dateArr[1]);
            var day = Utils.twoDigits(dateArr[2]);*/
            var year = d.getFullYear();
            var month =  Utils.twoDigits(d.getMonth()+1);
            var day =  Utils.twoDigits(d.getDate());
            if (onlyDate) {
                return year + '-' + month + '-' + day;
            } else {
                var hour = Utils.twoDigits(d.getHours());
                var min = Utils.twoDigits(d.getMinutes());
                var second = Utils.twoDigits(d.getSeconds());
                return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second;
            }
        }
        return ''
    }

    static twoDigits(d) {
        if (0 <= d && d < 10) return "0" + d + '';
        if (-10 < d && d < 0) return "-0" + (-1 * d) + '';
        return d + '';
    }

    static count_treatment_day(in_date, out_date, is_bhyt) {
        var day_treatment = 0;
        var onehour = 60 * 60 * 1000; // minutes*seconds*millisecond
        var oneday = 24 * 60 * 60 * 1000; // hours*minutes*seconds*millisecond
        if (!this.checkDateValid(out_date)) {
            out_date = new Date();
        }
        var diffHours = Math.round(Math.abs((out_date.getTime() - in_date.getTime()) / (onehour)));
        if (!is_bhyt) { // ko co BHYT
            if (diffHours > 4 && diffHours <= 24) {
                day_treatment = 1
            }
            if (diffHours > 24) {
                //Vào viện sau 12 giờ sáng ngày vào viện và ra viện trước 12 sáng ngày ra viện:
                if (in_date.getHours() >= 12 && out_date.getHours() <= 12) {
                    day_treatment = Math.round(Math.abs((out_date.getTime() - in_date.getTime()) / (oneday)));
                }
                //Vào viện trước 12 giờ sáng ngày vào viện và ra viện trước 12 giờ sáng ngày ra viện hoặc vào viện sau 12 giờ sáng ngày vào viện và ra viện sau 12 giờ sáng ngày ra viện
                if (in_date.getHours() <= 12 && out_date.getHours() <= 12 || in_date.getHours() >= 12 && out_date.getHours() >= 12) {
                    day_treatment = Math.round(Math.abs((out_date.getTime() - in_date.getTime()) / (oneday))) + 0.2;
                }
                //Vào viện trước 12 giờ sáng ngày vào viện và ra viện sau 12 giờ sáng ngày ra viện:
                if (in_date.getHours() <= 12 && out_date.getHours() >= 12) {
                    day_treatment = Math.round(Math.abs((out_date.getTime() - in_date.getTime()) / (oneday))) + 0.4;
                }
            }
        } else { // co bhyt
            if (diffHours <= 24) {
                day_treatment = 1
            }
            day_treatment = Math.round(Math.abs((out_date.getTime() - in_date.getTime()) / (oneday)));
        }
        return day_treatment;
    }

    static countHourBeds(v) {
        var ret;
        if (v >= 1 && v < 6) {
            ret = 0.5;
        } else if (v >= 6) {
            var devision = parseInt(v / 24);
            var modulus = v % 24;
            if (modulus == 0 || modulus < 1) {
                ret = devision;
            } else if (modulus >= 1 && modulus < 6) {
                ret = devision + 0.5;
            } else {
                ret = devision + 1;
            }
        } else {
            ret = 0;
        }
        return ret;
    }

    static count_bed_day(in_date, out_date) {
        var onehour = 60 * 60 * 1000;
        if (!this.checkDateValid(out_date)) {
            out_date = new Date();
        }
        if (!this.checkDateValid(in_date)) {
            in_date = new Date();
        }
        var times = Math.abs(out_date.getTime() - in_date.getTime())
        var value = parseInt(times / onehour);
        return this.countHourBeds(value);
    }

    static genTictketCode(prefix, id) {
        var currentUtcTime = new Date();
        var d = new Date(currentUtcTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh'
        }));
        var y = d.getFullYear() + '';
        y = y.slice(-2);
        var m = Utils.twoDigits(d.getMonth() + 1);
        var _d = Utils.twoDigits(d.getDate());
        var _id = (id + '');
        if (_id.length > 3) {
            _id = _id.slice(-4);
        } else {
            _id = '0' + _id;
        }
        //return prefix + y + m + _d + _id;
        return prefix + y + m + _id;
    }

    static addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
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
    static checkDateValid(str_date) {
        var timestamp = Date.parse(str_date);
        if (isNaN(timestamp) == false) {
            return true;
        }
        return false;
    }

    static is_date_valid(str_date) {
        
        var timestamp = Date.parse(str_date);
        console.log('timestamp:', timestamp);
        return isNaN(timestamp) ? false : true;
    }
    /**
     * Thuc hien vong lam cua mang mot cach tuan tu
     * @param {*} array 
     * @param {*} callback 
     */
    static async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    /**
     * convert json to xml
     * @param {object} obj json
     * @param {*} proArr option (tuy chon, khong can truyen vao)
     * @return xml string
     */
    static json2Xml(obj, proArr) {
        var res = ''
        if (Utils.isEmpty(obj)) return ''
        if (typeof obj != 'object') return obj;
        for (let pro in obj) {
            if (isNaN(pro)) {
                res += '<' + pro + '>' + this.json2Xml(obj[pro], pro) + '</' + pro + '>'
            } else {
                var _proArr = proArr.substr(0, proArr.length - 1);
                res += '<' + _proArr + '>' + this.json2Xml(obj[pro], pro) + '</' + _proArr + '>'
            }
        }
        return res;
    }
    /**
     * Lay chieu dai (bytes) cua chuoi tieng Viet
     * @param {string} str 
     */
    static lengthInUtf8Bytes(str) {
        // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
        var m = encodeURIComponent(str).match(/%[89ABab]/g);
        return str.length + (m ? m.length : 0);
    }
}