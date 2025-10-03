/**
 * Created by TrungDV 25/12/2017.
 */
var reqsQueue = []

angular.module("app").factory('AppRequest', function ($http, $timeout) {
    var Post = function (uri, $rootScope, data, callback) {
        if (isDoubleReq(uri, data)) return;
        $rootScope.sysError = false;
        Configs.headerReq.userkey = $rootScope.$userkey;
        if (!checkReqData($rootScope, data)) return;
        if (Configs.mockup) {
            res = setMockupRes();
            callback(res);
            return;
        }
        $http({
            method: "POST",
            url: Configs.apiEndPoint + uri,
            data: data,
            headers: Configs.headerReq,
        }).then(function Success(res) {
            AppDebug.log(uri);
            AppDebug.log(res.data);
            if (checkResData($rootScope, res)) callback(res.data);
        }, function Fail(res) {
            AppDebug.log('System error...' + Configs.apiEndPoint + uri);
            $rootScope.sysError = true;
            $rootScope.sysErrorMsg = 'Can not connect to server';
            AppDebug.log(res);
        });
    }
    var Get = function (uri, $rootScope, callback) {
        if (isDoubleReq(uri)) return;
        $rootScope.sysError = false;
        Configs.headerReq.userkey = $rootScope.$userkey;
        if (Configs.mockup) {
            res = setMockupRes();
            callback(res);
            return;
        }
        $http({
            method: "GET",
            url: Configs.apiEndPoint + uri,
            headers: Configs.headerReq,
        }).then(function Success(res) {
            AppDebug.log(uri);
            AppDebug.log(res.data);
            if (checkResData($rootScope, res)) callback(res.data);
        }, function Fail(res) {
            AppDebug.log('System error...' + Configs.apiEndPoint + uri);
            $rootScope.sysError = true;
            $rootScope.sysErrorMsg = 'Can not connect to server';
            AppDebug.log(res);
        });
    }
    var Delete = function (uri, $rootScope, data, callback) {
        $rootScope.sysError = false;
        Configs.headerReq.userkey = $rootScope.$userkey;
        if (!checkReqData($rootScope, data)) return;
        if (Configs.mockup) {
            res = setMockupRes();
            callback(res);
            return;
        }
        $http({
            method: "DELETE",
            url: Configs.apiEndPoint + uri,
            data: data,
            headers: Configs.headerReq,
        }).then(function Success(res) {
            AppDebug.log(uri);
            AppDebug.log(res.data);
            if (checkResData($rootScope, res)) callback(res.data);
        }, function Fail(res) {
            AppDebug.log('System error...' + Configs.apiEndPoint + uri);
            $rootScope.sysError = true;
            $rootScope.sysErrorMsg = 'Can not connect to server';
            AppDebug.log(res);
        });
    }

    var uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        $http({
            method: "POST",
            url: Configs.apiEndPoint + uri,
            data: fd,
            headers: Configs.headerReq,
        }).then(function Success(res) {
            AppDebug.log(uri);
            AppDebug.log(res.data);
            if (checkResData($rootScope, res)) callback(res.data);
        }, function Fail(res) {
            AppDebug.log('System error...' + Configs.apiEndPoint + uri);
            $rootScope.sysError = true;
            $rootScope.sysErrorMsg = 'Can not connect to server';
            AppDebug.log(res);
        });
    }

    /* private functions */
    /**
     * check format data
     * @param {*} $rootScope 
     * @param {*} data 
     */
    function checkReqData($rootScope, data) {
        if (typeof (data) !== 'object') {
            $rootScope.sysError = true;
            $rootScope.sysErrorMsg = 'Data must be Object';
            return false;
        }

        return true;
    }
    /**
     * check format reponse
     * @param {*} res 
     */
    function checkResData($rootScope, res) {
        var data = res.data;
        if (typeof (data) !== 'object') {
            $rootScope.sysError = true;
            $rootScope.sysErrorMsg = 'Respone data must be Object';
            AppDebug.log(res);
            return false;
        } else if (!data.success && data.error && data.error.code > 1000) {
            AppDebug.log(res);
            $rootScope.sysError = true;
            $rootScope.sysErrorMsg = data.error.message;
            if (data.error.code == 10000) {
                window.location = '/';
            }
            return false;
        }

        return true;
    }

    function isDoubleReq(uri, data) {
        var res = false;
        if (undefined == data) data = 1;
        if (!reqsQueue[uri]) {
            reqsQueue[uri] = data;
            res = false;
        } else {
            var oldData = reqsQueue[uri];
            if (JSON.stringify(oldData) === JSON.stringify(data)) {
                res = true;
            } else {
                res = false;
            }
        }
        $timeout(function () {
            delete reqsQueue[uri];
        }, 200);

        return res;
    }

    function setMockupRes() {
        return {
            "success": Configs.mockupSuccess,
            "error": {
                "code": 200,
                "message": "success"
            },
            "data": {}
        };
    }

    return {
        Post: Post,
        Get: Get
    }
});

angular.module("app").factory('print', function ($window, $location) {
    return service ={
        print_div: print_div,
        print_data: print_data
    }
    function print_data(data, current_state, template){
        var _current = $location.path();
        $window.open(_current);
    }
});