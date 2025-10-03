
angular.module('app')
.controller('chiPhiCnt', ["$scope","$rootScope","AppRequest","$location", "$filter", "$localStorage"
, function traDoCnt($scope,$rootScope,AppRequest,$location, $filter, $localStorage) {
    var self = this;
    init();
    
    $scope.findFn = function(){
        find_out();
    }

    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
      $scope.branch = $localStorage.branch;
      $scope.oneBranch = $rootScope.user.uinfo.branch_id;
      let tu_ngay = new Date();
      tu_ngay.setMonth(tu_ngay.getMonth() - 1);
      let den_ngay = new Date();
      $scope.form = {
        tu_ngay: $filter('date')(tu_ngay, "dd/MM/yyyy"),
        den_ngay: $filter('date')(den_ngay, "dd/MM/yyyy"),
        chi_phi: 1,
        branch_id: ''+$scope.branch.branch_id,
      };
      find_out();
    }

    function find_out() {
        var data = Object.assign({},$scope.form);  // copy object
        AppRequest.Post('in_out_report/find_out', $rootScope, data,function(res){
            if(res.success){
                $scope.data_out = res.data;
                $scope.tong_chi = 0;
                for(let item of res.data){
                  $scope.tong_chi += item.tien_vay;
                }
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
}]);