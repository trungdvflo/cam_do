
angular.module('app')
.controller('comp_alertCnt', function comp_alertCnt($scope,$rootScope,AppRequest,$location, $mdDialog, $timeout) {
    var self = this;
    init();
    
    $scope.findFn = function(){
        $scope.paging.page = 1;
        find(1);
    }
    $scope.showAlertFormFn = function(ev, alert, key){
        $mdDialog.show({
            locals: {alert:alert, branchs: $scope.branchs, departments: $scope.departments},
            controller: DialogController,
            controllerAs: 'ctrl',
            templateUrl: 'views/elements/comp_alert_form.html',
            //parent: angular.element(document.body),
            parent: '#popupDialog',
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
            if(!answer.isEdit){
                // add alert
                $scope.data_list.unshift(answer);
            }else{
                // update branch id
                $scope.data_list[key] = answer;
            }
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
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
        $scope.form.branch = {branch_id:''};
        $scope.form.department = {department_id:''};
        $scope.form.enable = $scope.form.enable || {id:'1'}
        $scope.paging = {};
        $scope.paging.current_page = 1;
        $scope.paging.total_page = 1;
        $scope.paging.total_record = 1;
        $scope.paging.pages = [];
        $scope.limitShortContent = 30;
        $scope.limitTitle = 20;
        find();
        departments();
        branchs();
    }
    function find(page = 1) {
        var data = Object.assign({},$scope.form);  // copy object
        if(data.enable.id){ 
            data.enable = data.enable.id;
        }else{
            delete data.enable;
        }
        data.page = page;
        AppRequest.Post('comp_alert/find', $rootScope, data,function(res){
            if(res.success){
                $scope.data_list = res.data.data_list;
                var paging = res.data.paging;
                $scope.paging = Utils.pagingCalculator(paging);
                $scope.start_record = paging.row_per_page*(paging.current_page-1)+1;
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
    function branchs() {
        data = {};
        AppRequest.Post('branch/find', $rootScope, data,function(res){
            if(res.success){
                $scope.branchs = res.data;
                $scope.branchs.unshift({branch_id:'', vi_name:'--Chọn cơ sở--'})
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
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) >= 0);
        };
    }
  // end autocomplete

    function DialogController($scope, $mdDialog, $filter, alert, branchs, departments, $http) {
        alert.on = (alert.enable==1);
        alert.isEdit = (true && alert && alert.id);
        // alert.branch = {
        //     id: alert.branch_id
        // }
        // alert.department = {
        //     id : alert.department_id
        // }
        
        $scope.alert = Object.assign({}, alert);
        $scope.alert.department_id = ''+alert.department_id;
        $scope.alert.branch_id = ''+alert.branch_id;
        $scope.alert.start_time = ($scope.alert.start_time) ? $filter('date')($scope.alert.start_time, 'dd/MM/yyyy') : $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.alert.end_time = ($scope.alert.end_time) ? $filter('date')($scope.alert.end_time, 'dd/MM/yyyy') : $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.branchs = branchs;
        $scope.departments = departments;

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
            var startTime;
            var endTime;
            if(angular.isObject($scope.alert.start_time)){
                startTime = $filter('date')($scope.alert.start_time._d,'dd/MM/yyyy');
            }
            else {
                startTime = $filter('date')($scope.alert.start_time,'dd/MM/yyyy');
            }
            if(angular.isObject($scope.alert.end_time)){
                endTime = $filter('date')($scope.alert.end_time._d,'dd/MM/yyyy');
            }
            else {
                endTime = $filter('date')($scope.alert.end_time,'dd/MM/yyyy');
            }
            var startDay = parseInt(startTime.split('/')[0]) + parseInt(startTime.split('/')[1]) * 30 + parseInt(startTime.split('/')[2]) * 365;
            var endDay = parseInt(endTime.split('/')[0]) + parseInt(endTime.split('/')[1]) * 30 + parseInt(endTime.split('/')[2]) * 365;
            if($scope.alert.end_time && startDay > endDay){
                $scope.msg ="Ngày bắt đầu đang lớn hơn ngày kết thúc";
                return;
            }
            $scope.alert.enable = ($scope.alert.on)? 1: 0;
            var data = {
                id: $scope.alert.id,
                title: $scope.alert.title,
                short_content: $scope.alert.short_content,
                content: $scope.alert.content,
                branch_id: $scope.alert.branch_id,
                department_id: $scope.alert.department_id,
                start_time :  $scope.alert.start_time,
                end_time : $scope.alert.end_time,
                create_time : $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
                enable: $scope.alert.on
            }
            //AppDebug.log(data);
            var answer = $scope.alert;
            AppRequest.Post('comp_alert/save', $rootScope, data,function(res){
                if(res.success){
                    var objBranch = $scope.branchs.filter(function(item){
                        return item.branch_id == answer.branch_id;
                    });
                    if(objBranch.length > 0){
                        answer.b_vi_name = objBranch[0].vi_name;
                    }
                    var objDepartment = $scope.departments.filter(function(item){
                        return item.department_id == answer.department_id;
                    });
                    if(objDepartment.length > 0){
                        answer.d_vi_name = objDepartment[0].vi_name;
                    }
                    
                    if(angular.isObject(answer.start_time)){
                        answer.start_time = $filter('date')(answer.start_time._d,'dd/MM/yyyy');
                    }
                    if(angular.isObject(answer.end_time)){
                        answer.end_time = $filter('date')(answer.end_time._d,'dd/MM/yyyy');
                    }
                    if(!alert.isEdit){
                        $scope.alert.id = res.data.insertId;
                        answer.id = res.data.insertId;
                    }
                    $mdDialog.hide(answer);
                }else{
                    $scope.msg = res.error.message;
                }
            });
        };
        // for autocomplete
        // this.searchText = alert.name;
        // this.querySearch   = querySearch;
        // this.selectedItemChange = selectedItemChange;
        // this.searchTextChange   = searchTextChange;
        // function querySearch (text) {
        //     if(!text || undefined==text) return [];
        //     var data = {name: text};
        //     return findEmployee(data, 1);
        // }

        // function searchTextChange(text) {
        // }

        // function selectedItemChange(item) {
        //     if(item && item.person_id){
        //         $scope.alert.person_id = item.person_id;
        //         $scope.alert.update_name = item.name;
        //         $scope.alert.update_employee_code = item.employee_code;
        //     }
        // }
        // function findEmployee(data = {}, page = 1) {
        //     data.page = page;
        //     data.enable = 1;
        //     return $http({
        //         method : "POST",
        //         url : Configs.apiEndPoint + 'employee/find',
        //         data : data,
        //         headers : Configs.headerReq,
        //     }).then(function Success(res) {
        //         return res.data.data.data_list;
        //     });
        // }
    }
});