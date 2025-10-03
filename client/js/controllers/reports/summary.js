angular.module('app.report')
.controller('report_summaryCnt', ["$scope","$rootScope","AppRequest","$localStorage", "$filter"
, function report_summaryCnt($scope,$rootScope,AppRequest,$localStorage, $filter) {
    var self = this;
    init();

    function init() {
        $scope.branch = $localStorage.branch;
        $scope.oneBranch = $rootScope.user.uinfo.branch_id;
        $scope.form = {
            branch_id: ''+$scope.branch.branch_id,
        }
        getSummary();
    }

    function getSummary(){
        var data = Object.assign({},$scope.form);
        AppRequest.Post('summary_report/get_balance', $rootScope, data,function(res){
            if(res.success){
                $scope.summary = res.data;
                $scope.summary.ton_quy = $scope.summary.von - $scope.summary.rut_quy
                    - $scope.summary.tong_vay + $scope.summary.tong_tra
                    + $scope.summary.tong_loi - $scope.summary.tong_chi;
                getThisMonth();
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function getThisMonth(){
        let from = new Date();
        let to = new Date();
        from.setDate(1);
        to.setMonth(to.getMonth()+1);
        to.setDate(0);
        const data = {
            from,
            to,
            branch_id: $scope.form.branch_id,
        };
        AppRequest.Post('summary_report/get_balance/', $rootScope, data,function(res){
            if(res.success){
                $scope.this_month = res.data;
                getLashMonth();
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function getLashMonth(){
        let from = new Date();
        let to = new Date();
        from.setDate(1);
        from.setMonth(from.getMonth()-1);
        // to.setMonth(to.getMonth()-1);
        to.setDate(0);
        const data = {
            from,
            to,
            branch_id: $scope.form.branch_id,
        };
        AppRequest.Post('summary_report/get_balance/1', $rootScope, data,function(res){
            if(res.success){
                $scope.last_month = res.data;
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
}]);