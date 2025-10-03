
angular.module('app')
.controller('group_permissionCnt', function permissionCnt($scope,$rootScope,AppRequest,$localStorage, $http, $timeout) {
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
        $localStorage.group_permission.hide = $scope.hide;
    }
    $scope.changePermission = function(action){
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
        data.gid = $scope.form.group_id;
        AppRequest.Post('group_permission/change_group_action_map', $rootScope, data, function(res){
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
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(t){
        var self = t;
        $scope.group_action = true;
        $scope.group_report = false;
        findGroup();
        // autocomplete
        self.simulateQuery = false;
        self.isDisabled    = false;

        self.repos         = loadGroup();
        self.querySearch   = querySearch;
        $scope.autoComItems = []
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;
        // end autocomplete

        $scope.form = {};
        $scope.group = {};
        $localStorage.group_permission = $localStorage.group_permission || {};

        var params = $rootScope.params;
        if(params){
            if(params.group_id && params.group_name){
                load_permission_list(params.group_id);
                $scope.group.id = params.group_id;
                $scope.group.name = params.group_name;
                $scope.form.group_id = params.group_id;
                $scope.form.name = params.group_name;
                self.searchText = params.group_name;
            }
        }else{
            $rootScope.params = {}
        }
    }
    function load_permission_list(id='') {
        AppRequest.Get('group_permission/load_permission_list/' +id, $rootScope, function(res){
            if(res.success){
                $scope.data = res.data;
                $scope.hide = $localStorage.group_permission.hide;
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
    function add_action(action) {
        var data = {
            acl_user_group_id : $scope.form.group_id,
            acl_action_id: action.id
        }
        AppRequest.Post('group_permission/add_action_map', $rootScope, data, function(res){
            if(res.success){
                //$scope.data = res.data;
            }else{
                $scope.msg = res.error.message;
                action.on = false;
            }
        });
    }
    function del_action(action) {
        var data = {
            acl_user_group_id : $scope.form.group_id,
            acl_action_id: action.id
        }
        AppRequest.Post('group_permission/del_action_map', $rootScope, data, function(res){
            if(res.success){
                //$scope.data = res.data;
            }else{
                $scope.msg = res.error.message;
                action.on = true;
            }
        });
    }

    function loadGroup() {
        if(!$scope.groups){
            $timeout(loadGroup, 1000);
            return;
        }
        var repos = $scope.groups;
        self.repos = repos.map( function (repo) {
            //repo.value = repo.value.toLowerCase();
            return repo;
        });
        return self.repos;
    }
    function findGroup() {
        data = {};
        AppRequest.Post('user_group/find', $rootScope, data,function(res){
            if(res.success){
                $scope.groups = res.data;
            }else{
                $scope.msg = res.error.message;
                $scope.groups = [];
            }
        });
    }

    // for autocomplete
    function searchTextChange(text) {
    }
    
    function selectedItemChange(item) {
        if(item){
            $scope.form.group_id = item.id;
            $scope.group = item;
            load_permission_list($scope.form.group_id);
        }
    } 
    
    function querySearch(query){
        var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos
        return results;
    }    
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(item) {
            var value = angular.lowercase(item.value);
            var name = angular.lowercase(item.name);
            return (value.indexOf(lowercaseQuery) >= 0) || (name.indexOf(lowercaseQuery) >= 0);
        };
    }
    // end autocomplete

});