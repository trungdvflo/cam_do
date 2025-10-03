
angular.module('app')
.controller('salaryCnt',["$scope","$rootScope","AppRequest", "$filter", "$stateParams", "$localStorage"
, function salaryCnt($scope,$rootScope,AppRequest, $filter, $stateParams, $localStorage) {
    var self = this;
    init();

    $scope.saveFn = function () {
        save();
    }
    $scope.deleteFn = function (ev, value) {
      data = {
        branch_id: $scope.branch.branch_id,
      };
      AppRequest.Post('salary/delete/'+value.id, $rootScope, data,function(res){
          if(res.success){
              find()
          }else{
              $scope.msg = res.error.message;
          }
      });
    }
    $scope.payFn = function (ev, value) {
      data = {
        branch_id: $scope.branch.branch_id,
      };
      AppRequest.Post('salary/pay/'+value.id, $rootScope, data,function(res){
          if(res.success){
              find()
          }else{
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
        let balance_date = new Date();
        $scope.form = {
          balance_date: $filter('date')(balance_date, "dd/MM/yyyy"),
          branch_id: $scope.branch.branch_id,
        };
        find();
    }
    function save() {
        if($scope.form.balance_date===false) {
            $scope.form.balance_date = "";
        }
        if ($scope.myForm.$invalid) {
            $scope.msg = 'Thông tin nhập chưa đúng, vui lòng kiểm tra lại';
            $scope.formChecked = true;
            return;
        }
        var data = Object.assign({},$scope.form);  // copy object
        AppRequest.Post('salary/save', $rootScope, data,function(res){
            if(res.success){
                find()
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function find(id){
      const data = {
        id,
        branch_id: $scope.branch.branch_id,
      }
      AppRequest.Post('salary/find', $rootScope, data, function(res){
        if(res.success){
          $scope.salaries = res.data;
        }else{
          $scope.msg = res.error.message;
        }
      });
    }

}]);