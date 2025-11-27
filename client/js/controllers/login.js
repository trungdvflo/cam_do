angular.module('app')
.controller('loginCnt', ["$scope","$rootScope","AppRequest","$location","$localStorage","$mdDialog"
, function loginCnt($scope,$rootScope,AppRequest,$location,$localStorage,$mdDialog) {
    init();
    $scope.loginFn = function() {
        AppRequest.Post('user/login', $rootScope, $scope.form,function(res){
            if(res.success){
                let user = res.data;
                $rootScope.user = user;
                $rootScope.$userkey = res.data.security.secret;
                $localStorage.userkey = res.data.security.secret;
                $localStorage.user = user;
                AppRequest.Post('branch/find', $rootScope, {
                    user_id: user.uinfo.user_id
                }, function(res){
                    $localStorage.branchs = res.data;
                    selectBranch($localStorage.user);
                })
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

    function selectBranch(user){
        if(user.uinfo.branch_id>0){
            for(let b of $localStorage.branchs){
                if(b.branch_id==user.uinfo.branch_id){
                    $localStorage.branch = b;
                    $localStorage.branch_id = b.branch_id;
                    $localStorage.branchs = [b];
                    $location.path("/loading-page");
                }
            }
        }else{
            branchDialog(user).then(function (answer) {
                $location.path("/loading-page");
            }, function () {
                delete $localStorage.branch;
                delete $localStorage.branch_id
                $location.path("/login");
            });
        }
    }

    /**
     *  chon ca làm khi login 
     * @param {object} data_user 
     */
    function branchDialog(data_user) {
        return $mdDialog.show({
            locals: { data_user: data_user },
            controller: DialogController,
            controllerAs: 'vm',
            templateUrl: 'views/pages/branch.dialog.html',
            parent: angular.element(document.body),
            targetEvent: null,

            clickOutsideToClose: false,
            fullscreen: true // Only for -xs, -sm breakpoints.
        })

    }
    function DialogController($scope, $mdDialog, data_user, $localStorage) {
        var vm = this;
        vm.branchs = [];
        for(let b of $localStorage.branchs){
            if(data_user.ubranchs.indexOf(b.branch_id)>=0){
                vm.branchs.push(b);
            }
        }

        vm.regiterBranchFn = regiterBranchFn;

        vm.work_day = new Date();

        var user = data_user.uinfo;

        vm.user = user;

        function regiterBranchFn() {
            $scope.msg = '';
            if (!vm.branch || !vm.branch.branch_id) {
                $scope.msg = 'Chưa chọn chi nhánh';
                return;
            }
            $localStorage.branch_id = vm.branch.branch_id;
            $localStorage.branch = vm.branch;
            $mdDialog.hide();
        }

        $scope.hideFn = function () {
            $mdDialog.hide();
        };
        $scope.cancelFn = function () {
            $mdDialog.cancel();
        };
    }
}]);