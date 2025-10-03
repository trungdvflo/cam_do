
angular.module('app')
.controller('baoCaoNgayCnt', ["$scope","$rootScope","AppRequest","$location", "$filter", "$localStorage"
, function baoCaoNgayCnt($scope,$rootScope,AppRequest,$location, $filter, $localStorage) {
    var self = this;
    init();
    
    $scope.findFn = function(){
        find_out();
        get_balance();
        get_report_date();
    }
    $scope.updateInFn = function(e, value){
        $location.path('/money_in/'+value.type+'/'+value.money_out_id+'/'+value.id);
    }
    $scope.updateOutFn = function(e, value){
        $location.path('/camdo/'+value.id);
    }
    $scope.reportFn = function(e){
        var data = {
            report_date: $scope.form.report_date,
            balance: $scope.balance,
            tong_chi: $scope.tong_chi,
            tong_thu: $scope.tong_thu,
            branch_id: $scope.form.branch_id,
        }
        $scope.has_item_not_rpt = false;
        $scope.has_rpt_date = true;
        AppRequest.Post('cam_do/report_closed', $rootScope, data,function(res){
            if(res.success){
            }else{
                $scope.has_rpt_date = false;
                $scope.msg = res.error.message;
            }
        });
    }
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.branch = $localStorage.branch;
        $scope.form = {
          report_date: $filter('date')(new Date(), "dd/MM/yyyy"),
          branch_id: $scope.branch.branch_id,
        };
        $scope.balance = 0;
        $scope.tong_thu = 0;
        $scope.tong_chi = 0;
        $scope.tong_tra = 0;
        $scope.tong_loi = 0;
        $scope.has_item_not_rpt = false;
        $scope.has_rpt_date = true;
        find_out();
        get_balance();
        get_report_date();
        // var date = new Date();
        // $scope.rp_month = date.getMonth() + 1;
        // $scope.rp_months = [1,2,3,4,5,6,7,8,9,10,11,12];
        // $scope.rp_year = date.getFullYear();
        // $scope.rp_years = [];
        // for(let i = 2021; i <= $scope.rp_year; i++) {
        //     $scope.rp_years.push(i);
        // }
        // $scope.rp_day = date.getDate();
        // $scope.rp_days = [];
        // for(let i = 1; i<=31; i++) {
        //     $scope.rp_days.push(i);
        // }
    }
    function get_balance() {
        var data = Object.assign({},$scope.form);  // copy object
        AppRequest.Post('cam_do/get_balance', $rootScope, data,function(res){
            if(res.success){
                $scope.balance = res.data.tien_tra + res.data.tien_loi - res.data.tien_vay;
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function get_report_date() {
        var data = {
            report_date: $scope.form.report_date,
            branch_id: $scope.form.branch_id,
        }
        delete $scope.report_data_date;
        AppRequest.Post('cam_do/get_report_date', $rootScope, data,function(res){
            if(res.success){
                if(res.data && res.data.id){
                    $scope.report_data_date = res.data;
                    $scope.has_rpt_date = true;
                }else{
                    $scope.has_rpt_date = false;
                }
            }else{
                $scope.has_rpt_date = false;
                $scope.msg = res.error.message;
            }
        });
    }

    function find_out() {
        var data = Object.assign({},$scope.form);  // copy object
        $scope.has_item_not_rpt = false;
        AppRequest.Post('cam_do/find_out', $rootScope, data,function(res){
            if(res.success){
                $scope.data_out = res.data;
                $scope.tong_chi = 0;
                for(let item of res.data){
                  $scope.tong_chi += item.tien_vay;
                  const check_edit = new Date(item.created_date);
                  check_edit.setMinutes(check_edit.getMinutes()+25);
                  if(check_edit > new Date()){
                      item.can_edit = true;
                  }
                  if(!item.is_reported){
                    $scope.has_item_not_rpt = true;
                  }
                }
                find_in();
            }else{
                $scope.msg = res.error.message;
            }
        });
    }

    function find_in() {
        var data = Object.assign({},$scope.form);  // copy object
        data.join_out = 1;
        AppRequest.Post('cam_do/find_in', $rootScope, data,function(res){
            if(res.success){
                $scope.data_in = res.data;
                $scope.tong_tra = 0;
                $scope.tong_loi = 0;
                for(let item of res.data){
                  $scope.tong_tra += item.tien_tra;
                  $scope.tong_loi += item.tien_loi;
                  const check_edit = new Date(item.created_date);
                  check_edit.setMinutes(check_edit.getMinutes()+25);
                  if(check_edit > new Date()){
                      item.can_edit = true;
                  }
                  if(!item.is_reported){
                    $scope.has_item_not_rpt = true;
                  }
                }
                $scope.tong_thu = $scope.tong_tra + $scope.tong_loi;
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
}]);