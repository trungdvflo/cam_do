
angular.module('app')
.controller('user_groupCnt', function user_groupCnt($scope,$rootScope,AppRequest,$location, $mdDialog, $timeout, Excel) {
    var self = this;
    init();
    
    $scope.showUserFormFn = function(ev, group, key){
        $mdDialog.show({
            locals: {group:group},
            controller: DialogController,
            templateUrl: 'views/pages/users/elements/group_form.html',
            parent: '#popupDialog',
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
    $scope.goPermissionFn = function(g){
        //$rootScope.params = {
            $rootScope.params.group_id = g.id
            $rootScope.params.group_name = g.name
        //}
        $location.path( "/user/group_permission" );
    }
    $scope.goUserFn = function(group){
        //$rootScope.params = {
            $rootScope.params.group_id = group.id
            $rootScope.params.group_name = group.name
        //}
        $location.path( "/user/management" );
    }
    $scope.exportToExcel=function(tableId, sheetName){ // ex: '#my-table'
        var fileName = sheetName + '_file.xls'
        var exportHref=Excel.tableToExcel(tableId, sheetName);
        $timeout(function(){
            //location.href=exportHref;
            var link = document.createElement('a');
            link.download = fileName;
            link.href = exportHref;
            link.click();
        },100); // trigger download
    }
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.form = {};
        //$scope.form.enable = 1;
        $rootScope.params = {};
        groups();
    }
    function groups() {
        data = {};
        AppRequest.Post('user_group/find', $rootScope, data,function(res){
            if(res.success){
                $scope.data_list = res.data;
            }else{
                $scope.msg = res.error.message;
            }
        });
    }

    function DialogController($scope, $mdDialog, group) {
        group.on = (group.deleted==0);
        group.isEdit = (true && group && group.id);
        $scope.group = Object.assign({},group);
        
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
            $scope.group.deleted = ($scope.group.on)? 0: 1;
            var data = {
                id: $scope.group.id,
                name: Utils.removeMultiSpaceAndTrim($scope.group.name),
                value: $scope.group.value,
                deleted: $scope.group.deleted
            }
            var answer = $scope.group;
            AppRequest.Post('user_group/save', $rootScope, data,function(res){
                if(res.success){
                    if(!group.isEdit){
                        answer.id = res.data.insertId;
                    }
                    $mdDialog.hide(answer);
                }else{
                    $scope.msg = res.error.message;
                }
            });
        };
    }
});