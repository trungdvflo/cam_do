
angular.module('app')
.controller('permissionCnt', function permissionCnt($scope,$rootScope,AppRequest, $http, $mdDialog, $localStorage) {
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
        $localStorage.permission.hide = $scope.hide;
    }
    $scope.changePermissionFn = function(ev, action){
        if(action.group_map_id>0){
            action.on = !action.on;
            $scope.msg = 'Đây là quyền nhóm, không thể thay đổi từ User';
            return false;
        }
        if(action.on){
            add_action(action);
        }else{
            del_action(action);
        }
    }
    $scope.changeGroupPermission = function(group){
        var data = {};
        data.id = group.id;
        data.on = group.on;
        data.actions = [];
        for(var a in group.actions){
            var act = group.actions[a];
            if(act.on != group.on){
                data.actions.push(act);
            }
        }
        if(data.actions.length==0) return;
        data.uid = $scope.form.user_id;
        AppRequest.Post('permission/change_group_action_map', $rootScope, data, function(res){
            if(res.success){
                var g = $scope.data[group.id];
                for(var a in g.actions){
                    act = g.actions[a];
                    act.on = group.on;
                }
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    $scope.showAddGroup = function(ev, group) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Xác nhận thêm quyền')
              //.textContent('Tất cả quyền từ nhóm ['+group.name+'] sẽ được thêm cho User này?')
              .textContent('Chức nằng này đang xây dựng')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Đồng ý')
              .cancel('Bỏ qua');
    
        $mdDialog.show(confirm).then(function() {
            //add_group_action();
        }, function() {
            $scope.status = 'You decided to keep your debt.';
        });
    };
    $scope.showConfirmResetGroup = function(ev, group) {
        var confirm = $mdDialog.confirm()
              .title('Xác nhận thiết lập quyền?')
              .textContent('Tất cả quyền của User sẽ bị xóa, sau đó thiết lập lại quyền theo nhóm ['+group.name+'] cho User này.')
              .targetEvent(ev)
              .ok('Đồng ý')
              .cancel('Bỏ qua');
    
        $mdDialog.show(confirm).then(function() {
            reset_group_action();
        }, function() {
            $scope.status = 'You decided to keep your debt.';
        });
    };
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(t){
        var self = t;

        $scope.group_action = true;
        $scope.group_report = false;
        // autocomplete
        self.simulateQuery = false;
        self.isDisabled    = false;

        self.querySearch   = querySearch;
        $scope.autoComItems = []
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;
        // end autocomplete

        $scope.form = {};
        $scope.user = {};
        $localStorage.permission = $localStorage.permission || {};

        var params = $rootScope.params;
        if(params){
            if(params.user_id && params.username){
                load_permission_list(params.user_id, params.acl_group_id);
                $scope.user.user_id = params.user_id;
                $scope.user.username = params.username;
                $scope.user.acl_group_id = params.acl_group_id;
                $scope.form.user_id = params.user_id;
                $scope.form.username = params.username;
                self.searchText = params.username;
                load_user_group($scope.user.acl_group_id);
            }
        }else{
            $rootScope.params = {}
        }
    }
    function load_permission_list(id, acl_group_id) {
        var data = {
            id: id,
            acl_group_id: acl_group_id
        }
        AppRequest.Post('permission/load_permission_list/' +id, $rootScope, data, function(res){
            if(res.success){
                $scope.data = res.data;
                $scope.hide = $localStorage.permission.hide;
                showHideAll();
                delete $scope.msg
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
    function load_user_group(acl_group_id){
        if(!acl_group_id) return;
        AppRequest.Get('user_group/get_group/' +acl_group_id, $rootScope, function(res){
            if(res.success){
                $scope.group = res.data;
                delete $scope.msg
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function add_action(action) {
        var data = {
            user_id : $scope.form.user_id,
            acl_action_id: action.id
        }
        AppRequest.Post('permission/add_user_action_map', $rootScope, data, function(res){
            if(res.success){
                //$scope.data = res.data;
                delete $scope.msg
            }else{
                $scope.msg = res.error.message;
                action.on = false;
            }
        });
    }
    
    function del_action(action) {
        var data = {
            user_id : $scope.form.user_id,
            acl_action_id: action.id
        }
        AppRequest.Post('permission/del_user_action_map', $rootScope, data, function(res){
            if(res.success){
                //$scope.data = res.data;
                delete $scope.msg
            }else{
                $scope.msg = res.error.message;
                action.on = true;
            }
        });
    }
    function reset_group_action() {
        var data = {
            user_id : $scope.form.user_id,
            acl_group_id: $scope.user.acl_group_id
        }
        AppRequest.Post('permission/del_user_action_map_all', $rootScope, data, function(res){
            if(res.success){
                load_permission_list(data.user_id, data.acl_group_id);
                delete $scope.msg
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function findUser(data = {}, page = 1) {
        data.page = page;
        data.enable = 1;
        return $http({
            method : "POST",
            url : Configs.apiEndPoint + 'user/find',
            data : data,
            headers : Configs.headerReq,
        }).then(function Success(res) {
            return res.data.data.data_list;
        });
    }

    // for autocomplete
    function searchTextChange(text) {
    }
    
    function selectedItemChange(item) {
        if(item){
            $scope.form.user_id = item.user_id;
            $scope.form.username = item.username;
            $scope.user.user_id = item.user_id;
            $scope.user.username = item.username;
            $scope.user.name = item.name;
            $scope.user.acl_group_id = item.acl_group_id;
            //$rootScope.params = $scope.user;
            $rootScope.params.user_id = item.user_id
            $rootScope.params.username = item.username
            $rootScope.params.name = item.name
            load_permission_list($scope.form.user_id, $scope.user.acl_group_id);
            load_user_group($scope.user.acl_group_id);
        }
    } 
    
    function querySearch(text){
        if(!text || undefined==text) return [];
        var data = {
            name_or_uname: text
        };
        return findUser(data, 1);
    }      
    // end autocomplete

});