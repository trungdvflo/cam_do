
angular.module('app')
.controller('employeeCnt', function employeeCnt($scope,$rootScope,AppRequest,$location, $mdDialog, $timeout, Excel) {
    var self = this;
    init();
    
    $scope.findFn = function(){
        $scope.paging.page = 1;
        find(1);
    }
    $scope.showEmployeeFormFn = function(ev, employee, key){
        $mdDialog.show({
            locals: {employee:employee, types: $scope.types, departments: $scope.departments, diplomas:$scope.diplomas},
            controller: DialogController,
            templateUrl: 'views/pages/users/elements/employee_form.html',
            parent: '#popupDialog',
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
            if(!answer.isEdit){
                // add employee
                answer.employee_type_id = answer.type.employee_type_id;
                $scope.data_list.unshift(answer);
            }else{
                // update type id
                AppDebug.log(answer);
                answer.employee_type_id = answer.type.employee_type_id;
                $scope.data_list[key] = answer;
            }
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    }
    $scope.templateToExcelFn=function(){ // ex: 'views/pages/employee.html'
        if ( $scope.data_list_all && $scope.data_list_all.length > 0 ) {
            document.getElementById('download-as-excel').click();
        } else {
            var data = Object.assign({},$scope.form);  // copy object
            if(data.enable.id){ 
                data.enable = data.enable.id;
            }else{
                delete data.enable;
            }
            data.type_id = data.type.employee_type_id;
            AppRequest.Post('employee/export_all', $rootScope, data,function(res){
                if(res.success){
                    $scope.data_list_all = res.data;
                    Utils.downloadClkTrigger($rootScope, $scope, $scope.data_list_all, $timeout);
                }else{
                    $scope.msg = res.error.message;
                }
            });
        }
    }
    $scope.gotoUserFn = function(u){
        //$rootScope.params = {
            $rootScope.params.user_id = u.user_id
            $rootScope.params.username = u.username
        //}
        $location.path( "/user/management" );
    }
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        // autocomplete
        self.repos         = loadAllDepart();
        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;
        // end autocomplete

        $scope.form = {};
        $scope.form.type = {employee_type_id:''};
        var params = $rootScope.params;
        if(params){
            if(params.type_id){
                $scope.form.type = {
                    id:params.type_id,
                    name:params.vi_name
                };
            }
            if(params.enable){
                $scope.form.enable = params.enable
            }else{
                $scope.form.enable = {id:Constants.N_ONE};
            }
            if(params.name){
                $scope.form.name = params.name
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
        $scope.diplomas = [];
        departments();
        types();
        diplomas();
        find(1);
    }
    function find(page) {
        var data = Object.assign({},$scope.form);  // copy object
        if(data.enable.id){ 
            data.enable = data.enable.id;
        }else{
            delete data.enable;
        }
        data.type_id = data.type.employee_type_id;
        data.page = page;
        AppRequest.Post('employee/find', $rootScope, data,function(res){
            if(res.success){
                $scope.data_list = res.data.data_list;
                var paging = res.data.paging;
                $scope.paging = Utils.pagingCalculator(paging);
                $scope.start_record = paging.row_per_page*(paging.current_page-1)+1;
                //$rootScope.params = {
                    if(data.acl_type_id) $rootScope.params.type_id = data.acl_type_id
                    $rootScope.params.enable = $scope.form.enable
                    $rootScope.params.name = data.name
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
    function types() {
        data = {};
        AppRequest.Post('employee/types', $rootScope, data,function(res){
            if(res.success){
                $scope.types = res.data;
                $scope.types.unshift({employee_type_id:'', vi_name:'--Chọn loại--'})
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function diplomas() {
        data = {};
        AppRequest.Post('employee/diplomas', $rootScope, data,function(res){
            if(res.success){
                $scope.diplomas = res.data;
            }else{
                $scope.msg = res.error.message;
            }
        });
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

    function DialogController($scope, $mdDialog, employee, types, departments, diplomas, $filter) {
        employee.on = (employee.enable==1);
        employee.isEdit = (true && employee.person_id);
        employee.type = {
            employee_type_id: employee.employee_type_id,
            vi_name: employee.t_vi_name
        }
        employee.department_id = ''+employee.department_id;
        employee.diploma_id = ''+employee.diploma_id;
        $scope.employee = Object.assign({}, employee);
        if(typeof employee.date_of_birth === 'object'){
            employee.date_of_birth = employee.date_of_birth._d;
        }
        $scope.employee.date_of_birth = (employee.date_of_birth) ? $filter('date')(employee.date_of_birth, 'dd/MM/yyyy') : $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.types = types;
        $scope.departments = departments;
        $scope.diplomas = diplomas;
        $scope.contracts = ENUM_CONST.CONTRACT_TYPES;
        
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
            $scope.employee.enable = ($scope.employee.on)? 1: 0;
            $scope.employee.t_vi_name = $scope.employee.type.vi_name;
            var data = {
                person_id: $scope.employee.person_id,
                name: Utils.removeMultiSpaceAndTrim($scope.employee.name),
                alias: $scope.employee.alias,
                employee_code: Utils.removeMultiSpaceAndTrim($scope.employee.employee_code),
                address: $scope.employee.address,
                employee_type_id: $scope.employee.type.employee_type_id,
                enable: $scope.employee.enable,
                department_id: $scope.employee.department_id,
                diploma_id: $scope.employee.diploma_id,
                contract_type: $scope.employee.contract_type,
                email: $scope.employee.email,
                phone_number: $scope.employee.phone_number,
                gender: $scope.employee.gender,
                date_of_birth: $scope.employee.date_of_birth,
                notes: $scope.employee.notes,
                ma_so_cc_hanh_nghe: $scope.employee.ma_so_cc_hanh_nghe,
                room_id: $scope.employee.room_id
            }
            if(!$scope.employee.user_id){ 
                data.username = $scope.employee.username;
            }

            var answer = $scope.employee;
            AppRequest.Post('employee/save', $rootScope, data,function(res){
                if(res.success){
                    if(!employee.isEdit){
                        answer.person_id = res.data.insertId;
                    }
                    $mdDialog.hide(answer);
                }else{
                    $scope.msg = res.error.message;
                }
            });
        };
    }
});