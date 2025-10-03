
angular.module('app')
.controller('permissionManagementCnt', function permissionCnt($scope,$rootScope,AppRequest, $mdDialog, $localStorage, $sce) {
    init(this);

    $scope.activeGroupFn = function(v){
        if($scope[v]) return;
        var tmp = $scope[v];
        $scope.group_action = false;
        $scope.group_report = false;
        $scope[v]=!tmp;
    }
    $scope.showGroupFn = function(group){
        group.hide = !group.hide;
    }
    $scope.showAllFn = function(){
        $scope.hide = !$scope.hide;
        showHideAll();
        $localStorage.permission_management.hide = $scope.hide;
    }
    $scope.showEditGroupFn = function(group){
        delete group.msg;
        group.isEdit=!group.isEdit;
    }
    $scope.delGroupFn = function(group, ev){
        delete group.msg;
        if(group.actions.length>0){
            group.msg = 'Không thể xóa group tồn tại action';
        }else
        {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Xác nhận xóa nhóm quyền')
                .textContent('Bạn có chắc chắn xóa nhóm quyền '+ group.name+ ' không? Hãy xác nhận kỹ trước khi xóa.')
                .ariaLabel('Hãy xác nhận')
                .targetEvent(ev)
                .ok(' Đồng ý ')
                .cancel(' Bỏ qua ');

            $mdDialog.show(confirm).then(function() {
                var data = {
                    id: group.id,
                    name: group.name
                }
                AppRequest.Post('permission/delete_group', $rootScope, data,function(res){
                    if(res.success){
                        var index = $scope.data.indexOf(group);
                        $scope.data.splice(index, 1);
                    }else{
                        group.msg = res.error.message;
                    }
                });
            }, function() {
                $scope.status = 'You decided to keep your debt.';
            });
        }
    }
    $scope.updateGroupFn = function(group){
        var data = {
            id: group.id,
            name: group.name
        }
        AppRequest.Post('permission/update_group', $rootScope, data,function(res){
            if(res.success){
                group.isEdit=!group.isEdit;
            }else{
                group.msg = res.error.message;
            }
        });
    }

    $scope.showAddGroupFn = function(){
        var new_group = {
            name: ''
        }
        $scope.new_group = new_group;
    }
    $scope.delNewGroupFn = function(){
        delete $scope.new_group;
    }
    $scope.addNewGroupFn = function(new_group){
        delete new_group.msg;
        if(!new_group.id || new_group.id.trim()==''){
            new_group.msg = 'Vui lòng nhập mã';
            return;
        }
        if(!new_group.name || new_group.name.trim()==''){
            new_group.msg = 'Vui lòng nhập tên';
            return;
        }
        if(!new_group.act_type_id || new_group.act_type_id.trim()==''){
            new_group.msg = 'Vui lòng chọn loại quyền';
            return;
        }
        new_group.id = new_group.id.trim();
        new_group.name = new_group.name.trim();
        var data = {
            id: new_group.id,
            name: new_group.name,
            act_type_id: new_group.act_type_id
        }
        AppRequest.Post('permission/add_group', $rootScope, data,function(res){
            if(res.success){
                new_group.actions = [];
                $scope.data.unshift(new_group);
                delete $scope.new_group;
            }else{
                new_group.msg = res.error.message;
            }
        });
    }

    // actions 
    $scope.showEditActionFn = function(action){
        action.isEdit=!action.isEdit;
    }
    $scope.showAddActionFn = function(group){
        group.new_action = {};
        group.isAddAction=!group.isAddAction;
    }
    $scope.delActionFn = function(group, action, ev){
        /*
        var confirm = $mdDialog.confirm()
        .title('Xác nhận xóa quyền')
        .textContent('Bạn có chắc chắn xóa quyền '+action.name+'? Nếu xóa quyền này thì [Người dùng] không thể truy cập action tương ứng')
        .ariaLabel('Xác nhận xóa')
        .targetEvent(ev)
        .ok(' Đồng ý ')
        .cancel(' Bỏ qua ');

        $mdDialog.show(confirm).then(function() {
            deleteAction();
        }, function() {
            $scope.status = 'You decided to keep your debt.';
        });*/

        var confirm = {
            title: "Xác nhận xóa quyền",
            content: $sce.trustAsHtml('Bạn có chắc chắn xóa quyền <b>'+action.name+'</b>?'),
            targetEvent: ev,
            cancelText: "BỎ QUA",
            okText: "ĐỒNG Ý"
        }
        Utils.confirm($mdDialog, confirm)
            .then(function(isOK){
                if(isOK){
                    deleteAction();
                }
            });
        
        function deleteAction(){
            var data = {
                id: action.id,
                url: action.url,
                name: action.name
            }
            AppRequest.Post('permission/delete_action', $rootScope, data,function(res){
                if(res.success){
                    var index = group.actions.indexOf(action);
                    group.actions.splice(index, 1);
                }else{
                    action.msg = res.error.message;
                }
            });
        }
    }
    $scope.updateActionFn = function(action){
        if(!action.name || !action.url){
            action.msg = 'Tên quyền và mã quyền không được trống';
        }else{
            var data = {
                id: action.id,
                url: action.url,
                name: action.name,
				acl_type: action.acl_type,
                _order: action._order
            }
            AppRequest.Post('permission/update_action', $rootScope, data,function(res){
                if(res.success){
                    action.isEdit = false;
                }else{
                    action.msg = res.error.message;
                }
            });
        }
    }
    $scope.addActionFn = function(group, new_action){
        if(!new_action.name || !new_action.url|| !new_action._type){
            new_action.msg = 'Nhập dữ liệu chưa đúng';
        }else{
            delete new_action.msg;
            var data = {
                url: new_action.url,
                name: new_action.name,
                _order: new_action._order,
                acl_group_action_id: group.id,
                _type: new_action._type,
				acl_type: new_action.acl_type,
                acl_type_action_id: new_action.acl_type_action_id
            }
            AppRequest.Post('permission/add_action', $rootScope, data,function(res){
                if(res.success){
                    group.isAddAction = false;
                    new_action.id = res.data.insertId;
                    group.actions.push(new_action);
                }else{
                    new_action.msg = res.error.message;
                }
            });
        }
    }
    
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(t){
        var self = t;

        $scope.data = {};
        $scope.user = {};
        $scope.group_action = true;
        $scope.group_report = false;
        $localStorage.permission_management = $localStorage.permission_management || {};
       // $scope.hide = true;
        load_all_permission();
    }
    function load_all_permission() {
        AppRequest.Get('permission/load_all_permission/', $rootScope, function(res){
            if(res.success){
                $scope.data = res.data;
                $scope.hide = $localStorage.permission_management.hide;
                showHideAll();
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    var showHideAll = function(){
        for(var g in $scope.data){
            var group = $scope.data[g];
            group.hide = $scope.hide;
        }
    }
});