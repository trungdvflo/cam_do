// loadingCnt, navbarCnt, sidebarCnt, topnavCnt
angular.module('app')
.controller('loadingCnt', ["$scope", "$state", "$localStorage", "$timeout",
function loadingCnt($scope,$state, $localStorage, $timeout) {
    init();
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        var tranSt = $localStorage.transition_to;
        var transto = 'app.main', param=null;
        if(typeof tranSt === 'string'){
            var trans = tranSt.split('|');
            if(trans[0]==$localStorage.user.uinfo.username){
                transto = trans[1];
            }
            if(trans[2]){
                var ps = trans[2].split(':');
                param = {};
                param[ps[0]] = ps[1]
            }
        }
        var ignores = ['appSimple.login', 'appSimple.slogin', 'appSimple.change_pass', 'app.loading-page'];
        if(!transto || ignores.includes(transto)){
            transto = 'app.main';
        }
        if($localStorage.user.uinfo.username=='kios01'){
            transto = 'appkios.kios.menu';
        }
        $timeout(function(){
            $state.go(transto, param); 
        }, 30)
    }
}])
.controller('navbarCnt', ["$scope","$rootScope","AppRequest","$location","$localStorage", "$state",
function navbarCnt($scope,$rootScope,AppRequest,$location,$localStorage,$state) {
    init();
    $scope.logoutFn = function() {
        AppRequest.Post('user/logout', $rootScope, $scope.form,function(res){
            if(res.success || res.error.code>1000){
                //$rootScope.ACL = {};
                //$rootScope.user = null;
                delete $rootScope.ACL;
                delete $rootScope.user;
                $location.path( "/login" );
            }else{
                $scope.msg = res.error.message;
            }
            
        });
    }
    $scope.changeBranchFn = function () {
        $localStorage.branch = $scope.br.branch;
        $localStorage.branch_id = $scope.br.branch.branch_id;
        $state.reload();
    }
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.msg = '';
        $scope.form = {};
        $scope.branchs = $localStorage.branchs;
        $scope.br = {
            branch: Object.assign({}, $localStorage.branch)
        };
        loadACL();
    }
    function loadACL(){
        AppRequest.Post('user/load_acl', $rootScope, $scope.form,function(res){
            if(res.success){
                $rootScope.ACL = res.data;
            }else{
                $scope.msg = res.error.message;
                $rootScope.ACL = {};
                $location.path( "/login" );
            }            
        });
    }
}])
.controller('sidebarCnt', ["$scope","$rootScope","AppRequest",
function sidebarCnt($scope,$rootScope,AppRequest) {
    init();

    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.msg = '';
        $scope.form = {};
        $scope.form.patient_cd = ''
    }
}])
.controller('topnavCnt', ["$scope","$rootScope","AppRequest",
function topnavCnt($scope,$rootScope,AppRequest) {
    init();
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.msg = '';
        $scope.form = {};
    }
}])
.controller('changePassCnt', ["$scope","$rootScope","AppRequest","$location", "$timeout",
function changePassCnt($scope,$rootScope,AppRequest,$location, $timeout) {
    init();
    $scope.changePassFn = function(){
        $scope.msg = null;
        if($scope.change_pass.new_pass != $scope.change_pass.re_new_pass){
            $scope.msg = 'Nhập lại mật khẩu không khớp';
            return;
        }
        if ($scope.userForm.$invalid) {
            $scope.msg = 'Thông tin nhập chưa đúng, vui lòng kiểm tra lại';
            $scope.formChecked = true;
            return;
        }

        AppRequest.Post('user/change_pass', $rootScope, $scope.change_pass,function(res){
            if(res.success){
                $scope.msg = 'Đổi mật khẩu thành công';
                $scope.change_pass.success = true;
                $timeout(function(){
                    $location.path( "/login" );
                }, 3000)
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
        /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.msg = '';
        $scope.change_pass = {};
    }
}])
