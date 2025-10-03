var scanQRCode = {
    isScanning: false,
    codeSt:     '',
    time:       new Date().getTime()
}
function parseQrcBHYT(scanQRCode, $scope, t){
    var qrcode = scanQRCode.codeSt;
    var space = '|';
    if(qrcode && qrcode.indexOf('|')>0){
        scanQRCode.isScanning=true;
        $("#qr_code_is_scanning").show();
    }else if(qrcode && qrcode.indexOf('\\')>0){
        scanQRCode.isScanning=true;
        space = '\\';
        $("#qr_code_is_scanning").show();
    }else{
        scanQRCode.isScanning=false;
        $("#qr_code_is_scanning").hide();
        return false;
    }

    try{
        var _qrcodes = qrcode.split(space);
        if(_qrcodes.length<15){
            return false;
        } 
        if($scope==null){
            $scope = angular.element(t).scope()
        }
        var _code = _qrcodes[0];
        var _name = decodeHex(_qrcodes[1]);
        var _birth = _qrcodes[2];
        var _gender = _qrcodes[3];
        var _address = decodeHex(_qrcodes[4]);
        var _kcb = _qrcodes[5];
        var _startTime = _qrcodes[6];
        var _endTime = _qrcodes[7];

        if($scope && $scope.out_regst){
            $scope.out_regst.name = _name;
            if(_birth.indexOf('/')>0){
                var _bs = _birth.split('/')
                $scope.out_regst.date_birth = _bs[0]
                $scope.out_regst.date_month = _bs[1]
                $scope.out_regst.date_year = _bs[2]
            }else{
                $scope.out_regst.date_year = _birth
            }
            $scope.out_regst.gender = (_gender==1||_gender=='1')?'male':'female';
            var _adds = _address.split(',')
            $scope.out_regst.fulladdress = _address;
            $scope.out_regst.street = _adds[0];

            $scope.out_regst.insuarance_num_1 = _code.substr(0,2);
            $scope.out_regst.insuarance_num_2 = _code.substr(2,1);
            $scope.out_regst.insuarance_num_3 = _code.substr(3,2);
            $scope.out_regst.insuarance_num_4 = _code.substr(5,2);
            $scope.out_regst.insuarance_num_5 = _code.substr(7,3);
            $scope.out_regst.insuarance_num_6 = _code.substr(10,5);

            $scope.out_regst.first_treatment_province_code = _kcb.split(' - ')[0]
            $scope.out_regst.first_treatment_hospital_code = _kcb.split(' - ')[1]
            var _sTs = _startTime.split('/')
            $scope.out_regst.bhyt_date_start = _sTs[0]
            $scope.out_regst.bhyt_month_start = _sTs[1]
            $scope.out_regst.bhyt_year_start = _sTs[2] 
            var _eTs = _endTime.split('/')
            $scope.out_regst.bhyt_date_end = _eTs[0]
            $scope.out_regst.bhyt_month_end = _eTs[1]
            $scope.out_regst.bhyt_year_end = _eTs[2] 

            $scope.out_regst.enum_examination_type = '2';
        }
        setBtnFocus();
        scanQRCode.isScanning=false;
        $("#qr_code_is_scanning").hide();
        //console.log(_code, _name, _birth, _gender, _address, _kcb);
        return true;
    }catch(err){
        AppDebug.log(err);
        scanQRCode.isScanning=false;
        $("#qr_code_is_scanning").hide();
        return false;
    }
}
function hex2Dec(str){
    return parseInt(str, 16)
}
function decodeHex(s){
    if(!s) return '';
    return decodeURIComponent(s.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
    /*var res = ''
    var hex = ''
    for(let i=0;i<nameHex.length;i+=2){
        hex = nameHex.substr(i, 2);
        res += String.fromCharCode(hex2Dec(hex));
    }
    return res;*/
}
/*
String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}*/
function qrcodeBHYTKeyup(t){
    scanQRCode.codeSt = t.value;
    //var scope = angular.element(t).scope()
    var scope = null;
    if(parseQrcBHYT(scanQRCode, scope, t)){
        scanQRCode.codeSt = ''
        setTimeout(function(){
            if(scope==null){
                scope = angular.element(t).scope()
            }
            scanQRCode.codeSt = ''
            scope.findByNumBhytFn();
            scanQRCode.isScanning=false;
            $("#qr_code_is_scanning").hide();
            $("#qr_code_text_box").val('');
            t.value = '';
        },10)
    }
}
function parseHisQcode(text){
    if(!text || text.indexOf('|')<0){
        return false;
    }
    try{
        var _qrcodes = text.split('|');
        if(_qrcodes.length<7){
            return false;
        } 
        return _qrcodes;
    }catch(err){
        AppDebug.log(err);
        return false;
    }
}
function setBtnFocus(){
    var btns = document.querySelectorAll('button');
    angular.element(btns[0]).focus();
}
function qcodeFind(t){
    var _qrcodes = parseHisQcode(t.value);
    if(_qrcodes && _qrcodes[1]){
        var _code = _qrcodes[1];
        var scope = angular.element(t).scope()
        scope.form.patient_code = _code;
        scope.findFromQcode(t, _code);
        setBtnFocus();
        t.value = _code;
    } 
}
function patientCdInPaymentKeyUp(t){
    qcodeFind(t); 
}
function patientCdOutPaymentKeyUp(t){
    qcodeFind(t); 
}
function patientCdOutPaymentInsuranceKeyUp(t){
    qcodeFind(t); 
}
function patientCdEInvoiceKeyUp(t){
    qcodeFind(t); 
}
