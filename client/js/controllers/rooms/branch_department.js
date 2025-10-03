
angular.module('app')
.controller('branch_departmentCnt', ["$scope", "$rootScope", "AppRequest", "$http", "$location", "$mdDialog", "$timeout", "Excel", function branch_departmentCnt($scope, $rootScope, AppRequest, $http, $location, $mdDialog, $timeout, Excel) {
    DialogController.$inject = ["$scope", "$mdDialog", "$http", "department", "branchs", "listDoctors", "listDept", "blocks"];
    var self = this;
    init();
    
    $scope.showUserFormFn = function(ev, department, key){
        $mdDialog.show({
            locals: {department:department, branchs: $scope.branchs, listDoctors: $scope.doctors, listDept: $scope.data_list, blocks: $scope.blocks},
            controller: DialogController,
            controllerAs: 'ctrl',
            templateUrl: 'views/pages/rooms/elements/department_form.html',
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
        $scope.DeptState = {id:''};
        $scope.branchSearch  = {branch_id:'1'};
        $scope.blockSearch  = {id:'1'};
        $rootScope.params = {};
        loadDepartmentData();
        loadBranchs();
        loadEmployees();
    }

    $scope.deptStateSelectedItemChangedFn = function(){
        $scope.findFn();
    }

    $scope.branchSelectedItemChangedFn = function(){
        if($scope.blocks[0].id == '1' && $scope.branchSearch != null){
            $scope.blocks.splice(0,1);
            $scope.blocks.unshift({id:'1', name:'--Chọn block--', deleted: 0,branch_id:$scope.branchSearch.branch_id});
            $scope.blockSearch  = {id:'1'};
        }
        $scope.findFn();
    }

    $scope.blockSelectedItemChangedFn = function(){
        $scope.findFn();
    }
    
    function loadDepartmentData() {
        var data = {
            key: 'search',
            branch_id: ($scope.branchSearch.branch_id == '1') ? '' : $scope.branchSearch.branch_id,
            lock_state: $scope.DeptState.id
        };
        AppRequest.Post('department/find', $rootScope, data,function(res){
            if(res.success){
                $scope.data_list = res.data;
            }else{
                $scope.msg = res.error.message;
            }
        });
    }

    function loadBranchs() {
        data = {};
        AppRequest.Post('branch/find', $rootScope, data,function(res){
            if(res.success){
                $scope.branchs = res.data;
                $scope.branchs.unshift({branch_id:'1', vi_name:'--Chọn cơ sở--',deleted: 0});
            }else{
                $scope.msg = res.error.message;
                $scope.branchs = [];
            }
        });
    }

    function loadEmployees() {
        data = {};
        data.type_id = Constants.DOCTOR;
        data.enable = Constants.ENABLE;
        AppRequest.Post('employee/find', $rootScope, data,function(res){
            if(res.success){
                $scope.doctors = res.data;
            }else{
                $scope.msg = res.error.message;
                $scope.doctors = [];
            }
        });
    }

    function DialogController($scope, $mdDialog, $http, department, branchs, listDoctors, listDept, blocks) {
        department.on = (department.deleted==0);
        department.isEdit = (true && department && department.department_id);
        $scope.department = Object.assign({},department);
        $scope.branchs = branchs;
        $scope.blocks = [];
        $scope.filterBlock = undefined;
        $scope.listDoctors = Object.assign({}, listDoctors);
        $scope.listDept = listDept;
        if(department.isEdit){
            // init branch
            $scope.department.branch = {
                branch_id: $scope.department.branch_id, 
                vi_name: $scope.department.b_vi_name
            };
            if($scope.department.bl_id){
                $scope.department.block = {
                    id: $scope.department.bl_id, 
                    name: $scope.department.bl_name
                };
            }
            $scope.department.type = {
                id: $scope.department.intern
            };
            // head dept
            $scope.department.employee_head = {};
            $scope.department.employee_head.id = $scope.department.head_id;
            $scope.department.employee_head.name = $scope.department.e_head_dept_name;
            // $scope.ctrl = {};
            // $scope.ctrl.selectedItemHeadDept = $scope.department.e_head_dept_name;
            // $scope.ctrl = {};
            $scope.selectedItemHeadDept = $scope.department.e_head_dept_name;
            // hs dept
            $scope.department.department_hs = {};
            $scope.department.department_hs.id = $scope.department.department_hs_id;
            $scope.department.department_hs.name = $scope.department.department_hs_name;
            // $scope.ctrl.selectedItemDept = $scope.department.department_hs_name;
            $scope.selectedItemDept = $scope.department.department_hs_name;

            $scope.blocks = blocks;
        }else{
            $scope.department.branch = {};
            $scope.department.branch.branch_id = '1';

            if($scope.blocks.length == 0){
                $scope.blocks.unshift({id:'1', name:'--Chọn block--', deleted: 0,branch_id:'1'});
                $scope.department.block = {};
                $scope.department.block.id = '1';
                $scope.filterBlock = '1';
            }
            $scope.department.type = {};
            $scope.department.type.id = '4';
        }

        $scope.branchChangeFn = function(){
            if($scope.department.branch){
                if($scope.department.branch.branch_id == '1'){
                    $scope.blocks = [];  
                }else{
                    $scope.filterBlock = $scope.department.branch.branch_id;
                    $scope.blocks = blocks;
                }
            }else{
                $scope.blocks = [];  
            }
        }

        $scope.hideFn = function() {
            $mdDialog.hide();
        };
    
        $scope.cancelFn = function() {
            $mdDialog.cancel();
        };

        $scope.saveFn = function() {
            // Check dept code
            $scope.checkedDeptCode = false;
            for(var i = 0; i < listDept.length; i++){
                if(listDept[i].dept_code != "" 
                && listDept[i].dept_code == $scope.department.dept_code 
                && $scope.department.dept_code != "" 
                && !department.isEdit){
                    $scope.checkedDeptCode = true;
                    $scope.myForm.$invalid = true;
                    break;
                }
            }
            if ($scope.myForm.$invalid
                || $scope.department.type.id == '4') {
                if($scope.department.branch && $scope.department.branch.branch_id == '1'){
                    $scope.myForm.branch.$error.required = true;
                }
                if($scope.department.type.id == '4'){
                    $scope.myForm.typeDept.$error.required = true;
                }
                $scope.msg = 'Thông tin nhập chưa đúng, vui lòng kiểm tra lại'  ;
                $scope.formChecked = true;
                return;
            }
            $scope.department.deleted = ($scope.department.on)? 0: 1;
            var data = {
                department_id: $scope.department.department_id, // =undefine if edit mode
                deleted: $scope.department.deleted,
                vi_name: $scope.department.vi_name,
                vi_description: ($scope.department.vi_description) ? $scope.department.vi_description: "",
                intern: ($scope.department.type.id == 4) ? 0 : $scope.department.type.id,
                branch_id: $scope.department.branch.branch_id,
                block_id: ($scope.department.block && $scope.department.block.id)?$scope.department.block.id:1,
                dept_code: ($scope.department.dept_code) ? $scope.department.dept_code : "",
                department_hs_id: ($scope.department.department_hs) ? $scope.department.department_hs.id : 0,
                head_id: ($scope.department.employee_head) ? $scope.department.employee_head.id : 0,
            }
            var answer = $scope.department;
            answer.intern = data.intern;
            answer.branch_id = data.branch_id;
            answer.b_vi_name = ($scope.department.branch) ? $scope.department.branch.vi_name : "";
            answer.e_head_dept_name = ($scope.department.employee_head) ? $scope.department.employee_head.name : "";
            answer.department_hs_name = ($scope.department.department_hs) ? $scope.department.department_hs.name : "";
            
            AppRequest.Post('department/save', $rootScope, data,function(res){
                if(res.success){
                    if(res.data.insertId && res.data.insertId>0){
                        answer.department_id = res.data.insertId;
                    }
                    $mdDialog.hide(answer);
                }else{
                    $scope.msg = res.error.message;
                }
            });
        };

        //autocomplete
        var self = this;
        self.cancel = function($event) {
            $mdDialog.cancel();
        };
        self.finish = function($event) {
            $mdDialog.hide();
        };

        //autocomplete find Dept BHYT
        $scope.querySearchDept   = querySearchDept;
        $scope.selectedItemChangeDept = selectedItemChangeDept;
        
        function querySearchDept (text) {
            if(!text || undefined==text) return [];
            var data = {vi_name: text};
           return findDeptHs(data);
        }
        function selectedItemChangeDept(item) {
            if ( item ) {
                $scope.department.department_hs = {};
                $scope.department.department_hs.id = item.department_hs_id;
                $scope.department.department_hs.name = item.vi_name;
            }else{
                $scope.department.department_hs = undefined;
            }
        } 
        function findDeptHs(data) { data = data? data:{};
            return $http({
                method : "POST",
                url : Configs.apiEndPoint + 'department_hs/find',
                data : data,
                headers : Configs.headerReq,
            }).then(function Success(res) {
                return res.data.data;
            });
        }
        //end autocomplete find Dept BHYT

        //autocomplete find head of Dept
        $scope.querySearchHeadDept   = querySearchHeadDept;
        $scope.selectedItemChangeHeadDept = selectedItemChangeHeadDept;
        function querySearchHeadDept (text) {
            if(!text || undefined==text) return [];
            var data = {
                name: text,
                type_id: Constants.DOCTOR,
                enable: Constants.ENABLE};
           return findHeadDept(data);
        }
        function selectedItemChangeHeadDept(item) {
            if ( item ) {
                $scope.department.employee_head = {};
                $scope.department.employee_head.id = item.person_id;
                $scope.department.employee_head.name = item.name;
            }else{
                $scope.department.employee_head = undefined;
            }
        } 
        function findHeadDept(data) { data = data? data:{};
            return $http({
                method : "POST",
                url : Configs.apiEndPoint + 'employee/find',
                data : data,
                headers : Configs.headerReq,
            }).then(function Success(res) {
                return res.data.data;
            });
        }
        //end autocomplete find head of Dept
    }

    //  $scope.findFn = function(){
    //     var data = {
    //         key: 'search',
    //         block_id: ($scope.blockSearch.id == '1') ? '' : $scope.blockSearch.id,
    //         lock_state: $scope.DeptState.id
    //     };
    //     if($scope.branchSearch!= null){
    //         if($scope.branchSearch.branch_id == '1'){
    //             data.branch_id = '';
    //         }else{
    //             data.branch_id = $scope.branchSearch.branch_id;
    //         }
    //     }else{
    //         data.branch_id = '';
    //     }
    //     return $http({
    //         method : "POST",
    //         url : Configs.apiEndPoint + 'department/find',
    //         data : data,
    //         headers : Configs.headerReq,
    //     }).then(function Success(res) {
    //         $scope.data_list = res.data.data;
    //     });
    // }

    $scope.findFn = function(){
        var data = {
            key: 'search',
            block_id: ($scope.blockSearch.id == '1') ? '' : $scope.blockSearch.id,
            lock_state: $scope.DeptState.id
        };
        if($scope.branchSearch!= null){
            if($scope.branchSearch.branch_id == '1'){
                data.branch_id = '';
            }else{
                data.branch_id = $scope.branchSearch.branch_id;
            }
        }else{
            data.branch_id = '';
        }
        AppRequest.Post('department/find', $rootScope, data, function(res){
            if(res.success){
                $scope.data_list = res.data;
            }
        });
    }
}]);