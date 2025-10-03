
angular.module('app')
.controller('branch_managementCnt', ["$scope", "$rootScope", "AppRequest", "$location", "$mdDialog", "$timeout", "Excel"
, function branch_managementCnt($scope, $rootScope, AppRequest, $location, $mdDialog, $timeout, Excel) {
    DialogController.$inject = ["$scope", "$mdDialog", "branch"];
    var self = this;
    init();
    
    $scope.showUserFormFn = function(ev, branch, key){
        $mdDialog.show({
            locals: {branch:branch},
            controller: DialogController,
            templateUrl: 'views/pages/rooms/elements/branch_form.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: true // Only for -xs, -sm breakpoints.
          })
          .then(function(answer) {
              if(!answer.isEdit){
                  // add user
                  $scope.data_list.unshift(answer);
              }else{
                  $scope.data_list[key] = answer;
              }
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
    }
    
    $scope.exportToExcelFn=function(){
        if ( $scope.data_list && $scope.data_list.length > 0 ) {
            document.getElementById('download-as-excel').click();
        }
    }
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.form = {};
        //$scope.form.enable = 1;
        $rootScope.params = {};
        loadBranchData();
    }
    function loadBranchData() {
        data = {};
        AppRequest.Post('branch/find', $rootScope, data,function(res){
            if(res.success){
                $scope.data_list = res.data;
            }else{
                $scope.msg = res.error.message;
            }
        });
    }

    function DialogController($scope, $mdDialog, branch) {
        branch.on = (branch.deleted==0);
        branch.isEdit = (true && branch && branch.branch_id);
        $scope.branch = Object.assign({},branch);
        
        $scope.hideFn = function() {
            $mdDialog.hide();
        };
    
        $scope.cancelFn = function() {
            $mdDialog.cancel();
        };
        
        $scope.saveFn = function() {
            if ($scope.myForm.$invalid) {
                $scope.msg = 'Thông tin nhập chưa đúng, vui lòng kiểm tra lại';
                $scope.formChecked = true;
                return;
            }
            $scope.branch.deleted = ($scope.branch.on)? 0: 1;
        
            var data = {
                branch_id: $scope.branch.branch_id,
                vi_name: $scope.branch.vi_name,
                vi_description: ($scope.branch.vi_description) ? $scope.branch.vi_description : '',
                is_local: $scope.branch.deleted,
                deleted: $scope.branch.deleted
            }
            var answer = $scope.branch;
            AppRequest.Post('branch/save', $rootScope, data,function(res){
                if(res.success){
                    if(res.data.insertId && res.data.insertId>0){
                        answer.branch_id = res.data.insertId;
                    }
                    $mdDialog.hide(answer);
                }else{
                    $scope.msg = res.error.message;
                }
            });
        };
    }
}]);