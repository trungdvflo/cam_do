
angular.module('app')
.controller('userCnt', ["$scope","$rootScope","AppRequest","$location", "$mdDialog", "$timeout", "Excel","Upload", "$localStorage"
, function userCnt($scope,$rootScope,AppRequest,$location, $mdDialog, $timeout, Excel,Upload, $localStorage) {
    var self = this;
    init();
    
    $scope.findFn = function(){
        $scope.paging.page = 1;
        find(1);
    }
    $scope.showUserFormFn = function(ev, user, key){
        $mdDialog.show({
            locals: {user:user, groups: $scope.groups},
            controller: DialogController,
            controllerAs: 'ctrl',
            templateUrl: 'views/pages/users/elements/user_form.html',
            //parent: angular.element(document.body),
            parent: angular.element(document.getElementById('popupDialog')),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
            if(!answer.isEdit){
                // add user
                $scope.data_list.unshift(answer);
            }else{
                // update group id
                answer.acl_group_id = answer.group.id;
                $scope.data_list[key] = answer;
            }
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    }
    $scope.showBranchFormFn = function(ev, user, key){
        $mdDialog.show({
            locals: {user:user},
            controller: DialogBranchController,
            controllerAs: 'ctrl',
            templateUrl: 'views/pages/users/elements/user_branch_form.html',
            //parent: angular.element(document.body),
            parent: angular.element(document.getElementById('popupDialog')),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
            find(1);
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    }
    $scope.goPermissionFn = function(user){
        //$rootScope.params = {
            $rootScope.params.user_id = user.user_id
            $rootScope.params.username = user.username
            $rootScope.params.acl_group_id = user.acl_group_id
        //}
        $location.path( "/user/permission" );
    }
    $scope.goEmployeeFn = function(e){
        //$rootScope.params = {
            $rootScope.params.user_id = e.user_id
            $rootScope.params.name = e.name
            $rootScope.params.username = e.username
        //}
        $location.path( "/user/employee" );
    }
    $scope.kickFn = function(user, ev){
        AppRequest.Post('user/kick_out', $rootScope, user,function(res){
            if(res.success){
                ev.currentTarget.hidden = true;
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    $scope.exportToExcelFn=function(tableId){ // ex: '#my-table'
        var exportHref=Excel.tableToExcel(tableId,'WireWorkbenchDataExport');
        $timeout(function(){location.href=exportHref;},100); // trigger download
    }
    $scope.templateToExcelFn=function(bid='download-as-excel'){ // ex: 'views/pages/user.html'
        if ( $scope.data_list_all && $scope.data_list_all.length > 0 ) {
            document.getElementById(bid).click();
        } else {
            var data = Object.assign({},$scope.form);  // copy object
            if(data.enable.id){ 
                data.enable = data.enable.id;
            }else{
                delete data.enable;
            }
            data.acl_group_id = data.group.id;
            AppRequest.Post('user/export_all', $rootScope, data,function(res){
                if(res.success){
                    $scope.data_list_all = res.data;
                    Utils.downloadClkTrigger($rootScope, $scope, $scope.data_list_all, $timeout, bid);
                }else{
                    $scope.msg = res.error.message;
                }
            });
        }
    }
    $scope.printDivFn = function(divName){
        if(!$scope.data_list || $scope.data_list.length<1){
            $scope.msg = 'Không có dữ liệu. Hãy click nút Tìm trước khi IN';
            return;
        }
        Utils.printDiv(divName);
    }
    $scope.printTemplateFn = function(bid='print_template_1'){ 
        $scope.data_print = $scope.data_list;
        Utils.printClkTrigger($rootScope, $scope, $scope.data_print, $timeout, bid);
    }
    $scope.showBtnFn = function(value){
        $scope.selectId = value.user_id;
    }
    
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.branchs = $localStorage.branchs;
        branchArray();
        // autocomplete
        self.repos         = loadAllDepart();
        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;
        // end autocomplete

        $scope.form = {};
        $scope.form.group = {id:''};
        var params = $rootScope.params;
        if(params){
            if(params.group_id){
                $scope.form.group = {
                    id:params.group_id,
                    name:params.group_name
                };
            }
            if(params.enable){
                $scope.form.enable = params.enable
            }else{
                $scope.form.enable = {id:Constants.N_ONE};
            }
            if(params.username){
                $scope.form.username = params.username
            }
        }else{
            $rootScope.params = {};
            $scope.form.enable = {id:Constants.N_ONE};
        }
        $scope.paging = {};
        $scope.paging.current_page = 1;
        $scope.paging.total_page = 1;
        $scope.paging.total_record = 1;
        $scope.paging.pages = [];
        find();
        departments();
        groups();
    }
    function find(page = 1) {
        var data = Object.assign({},$scope.form);  // copy object
        if(data.enable.id){ 
            data.enable = data.enable.id;
        }else{
            delete data.enable;
        }
        data.acl_group_id = data.group.id;
        data.page = page;
        AppRequest.Post('user/find', $rootScope, data,function(res){
            if(res.success){
                $scope.data_list = res.data.data_list;
                var paging = res.data.paging;
                $scope.paging = Utils.pagingCalculator(paging);
                $scope.start_record = paging.row_per_page*(paging.current_page-1)+1;
                //$rootScope.params = {
                    if(data.acl_group_id) $rootScope.params.group_id = data.acl_group_id
                    $rootScope.params.enable = $scope.form.enable
                    $rootScope.params.username = data.username
                //};
                // reset export all
                delete $scope.data_list_all;
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function departments() {
        data = {};
        AppRequest.Post('department/find', $rootScope, data,function(res){
            if(res.success){
                $scope.departments = res.data;
            }else{
                $scope.msg = res.error.message;
                $scope.departments = [];
            }
        });
    }
    function groups() {
        data = {};
        AppRequest.Post('user_group/find', $rootScope, data,function(res){
            if(res.success){
                $scope.groups = res.data;
                groupArray($scope.groups);
                $scope.groups.unshift({id:'', name:'--Chọn nhóm--'})
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function groupArray(groups){
        $scope.groupArray = []
        for(g of groups){
            $scope.groupArray[g.id] = g.name;
        }
    }
    function branchArray(){
        $scope.branchArray = []
        for(g of $scope.branchs){
            $scope.branchArray[g.branch_id] = g.vi_name;
        }
    }

    $scope.SetPage = function(page){        
        $scope.paging.current_page = page;
        find(page);
    }
    $scope.FirstPage = function(){        
        $scope.paging.current_page = 1;
        find(1);
    }
    $scope.EndPage = function(){        
        $scope.paging.current_page = $scope.paging.total_page;
        find($scope.paging.current_page);
    }

    // for autocomplete
    function querySearch (query) {
        var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos
        return results;
    }

    function searchTextChange(text) {
        if(!text) delete $scope.form.department_id;
    }

    function selectedItemChange(item) {
        if(item && item.department_id){
            // select khoa
            $scope.form.department_id = item.department_id;
        }
    }

    /**
     * Build `components` list of key/value pairs
     */
    function loadAllDepart() {
        if(!$scope.departments){
            $timeout(loadAllDepart, 1000);
            return;
        }
        var repos = $scope.departments;
        self.repos = repos.map( function (repo) {
            repo.value = repo.vi_name.toLowerCase();
            return repo;
        });
        return self.repos;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = Utils.convertVietnameseToViEn(angular.lowercase(query));

        return function filterFn(item) {
            var vi_name = Utils.convertVietnameseToViEn(angular.lowercase(item.vi_name));
            var vi_description = Utils.convertVietnameseToViEn(angular.lowercase(item.vi_description)); 
            return (vi_name.indexOf(lowercaseQuery) >= 0 || vi_description.indexOf(lowercaseQuery) >= 0);
        };
    }
  // end autocomplete

    function DialogController($scope, $mdDialog, user, groups, $http) {
        var t = this;
        user.on = (user.enable==1);
        user.isEdit = (true && user && user.user_id);
        user.group = {
            id: user.acl_group_id
        };
        user.branch = {
            branch_id: user.branch_id
        };
        $scope.user = Object.assign({}, user);
        $scope.groups = groups;
        $scope.branchs = Object.assign([],$localStorage.branchs);
        $scope.branchs.unshift({ branch_id:0, vi_name:'Nhiều chi nhánh'});

        $scope.uploadImageFn = function(){
            if(!$scope.user.username){
                $scope.msg = 'Vui lòng nhập tài khoản';
                return;
            }
            if ($scope.myForm.file.$valid && $scope.file) {
                //$timeout(upload, 100);
                upload($scope.file);
            }
        }
        
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
            if($scope.user.password && ($scope.user.password != $scope.user.password2)){
                $scope.msg = 'Nhập lại mật khẩu không đúng';
                return;
            }
            $scope.user.enable = ($scope.user.on)? 1: 0;
            var data = {
                user_id: $scope.user.user_id,
                username: $scope.user.username,
                password: $scope.user.password,
                person_id: $scope.user.person_id,
                enable: $scope.user.enable,
                room_id: $scope.user.room_id,
                branch_id: $scope.user.branch.branch_id,
                acl_group_id: $scope.user.group.id,
                signature_url: $scope.user.signature_url
            }
            var answer = $scope.user;
            AppRequest.Post('user/save', $rootScope, data,function(res){
                if(res.success){
                    if(!user.isEdit){
                        $scope.user.user_id = res.data.insertId;
                        answer.user_id = res.data.insertId;
                    }
                    $mdDialog.hide(answer);
                    AppDebug.log(answer);
                }else{
                    $scope.msg = res.error.message;
                }
            });
        };
        // for autocomplete
        this.searchText = user.name;
        this.querySearch   = querySearch;
        this.selectedItemChange = selectedItemChange;
        this.searchTextChange   = searchTextChange;
        function querySearch (text) {
            if(!text || undefined==text) return [];
            var data = {name: text};
            return findEmployee(data, 1);
        }

        function searchTextChange(text) {
        }

        function selectedItemChange(item) {
            if(item && item.person_id){
                $scope.user.person_id = item.person_id;
                $scope.user.name = item.name;
                $scope.user.employee_code = item.employee_code;
            }
        }
        function findEmployee(data = {}, page = 1) {
            data.page = page;
            data.enable = 1;
            return $http({
                method : "POST",
                url : Configs.apiEndPoint + 'employee/find',
                data : data,
                headers : Configs.headerReq,
            }).then(function Success(res) {
                return res.data.data.data_list;
            });
        }

        // private functions
        function upload(file){
            Upload.upload({
                url: Configs.apiEndPoint + 'user/upload_sign',
                headers: Object.assign({}, Configs.headerReq),
                data: {
                    u_sign: file, //pass file as data, should be user ng-model
                    username:$scope.user.username
                } 
            }).then(function (res) { //upload function returns a promise
                AppDebug.log(res.data)
                if(res.data.success){
                    $scope.user.signature_url = res.data.data.filename;
                }else{
                    $scope.msg = res.data.error.message;
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
            }, function (evt) { 
                AppDebug.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                t.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        }
    }

    function DialogBranchController($scope, $mdDialog, AppRequest, user) {
        var t = this;
        user.branch = {
            branch_id: user.branch_id
        };
        $scope.user = Object.assign({}, user);
        $scope.branchs = Object.assign([],$localStorage.branchs);
        console.log(user, $scope.branchs)
        findUserBrand();
        $scope.hideFn = function() {
            $mdDialog.hide();
        };
    
        $scope.cancelFn = function() {
            $mdDialog.cancel();
        };
        
        $scope.changeUserBranchFn = function(ub) {
            console.log("ub", ub);
            if(ub.on && !ub.user_branch_id){
                // add
                addUserBrand(ub);
            }else if(!ub.on && ub.user_branch_id>0){
                // remove
                removeUserBrand(ub);
            }
        }
        function findUserBrand(){
            $scope.user_branchs = [];
            const data = {
                user_id: user.user_id
            }
            AppRequest.Post('user_branch/find', $rootScope, data, function(res){
                for(let b of $scope.branchs){
                    let on = false;
                    let user_branch_id = 0;
                    for(let ub of res.data){
                        if(b.branch_id==ub.branch_id){
                            on = true;
                            user_branch_id = ub.id;
                        }
                    }
                    const ub = {...b,
                        on,
                        user_branch_id
                    }
                    $scope.user_branchs.push(ub);
                }
            })
        }
        function addUserBrand(ub) {
            const data = {
                user_id: user.user_id,
                branch_id: ub.branch_id
            }
            AppRequest.Post('user_branch/add', $rootScope, data,function(res){
                if(res.success){
                    ub.user_branch_id = res.insertId;
                    findUserBrand();
                }else{
                    $scope.msg = res.error.message;
                }
            });
        };
        function removeUserBrand(ub) {
            const data = {
                id: ub.user_branch_id
            }
            AppRequest.Post('user_branch/remove', $rootScope, data,function(res){
                if(res.success){
                    findUserBrand();
                }else{
                    $scope.msg = res.error.message;
                }
            });
        };
    }
}]);