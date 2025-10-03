angular.module('app')
.controller('loginCnt', function loginCnt($scope,$rootScope,AppRequest,$location,$localStorage) {
    init();
    $scope.loginFn = function() {
        AppRequest.Post('user/slogin', $rootScope, $scope.form,function(res){
            if(res.success){
                $rootScope.user = res.data;
                $rootScope.$userkey = res.data.security.secret;
                //$cookies.put('userkey', res.data.security.secret);
                $localStorage.userkey = res.data.security.secret;
                $localStorage.user = res.data;
                $location.path( "/loading-page" );
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
        $scope.form = {};
    }
});