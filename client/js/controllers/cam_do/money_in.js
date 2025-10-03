
angular.module('app')
.controller('money_inCnt',["$scope","$rootScope","AppRequest","$location", "$filter", "$localStorage", "$stateParams"
, function money_inCnt($scope,$rootScope,AppRequest,$location, $filter, $localStorage, $stateParams) {
    var self = this;
    init();

    $scope.saveFn = function () {
        save();
    }
    $scope.processFn = function(type){
      $location.path('/money_in/' + type + '/' + $stateParams.money_out_id + '/');
    }
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
      $scope.branch = $localStorage.branch;
      if ($stateParams && $stateParams.money_out_id>0 && $stateParams.type != MONEY_IN_TYPE.von) {
        getMoneyOut($stateParams.money_out_id);
      }else if ($stateParams && $stateParams.id>0) {
        getMoneyIn($stateParams.id);
      }
      let ngay_tra = new Date();
      $scope.form = {
        ngay_tra: $filter('date')(ngay_tra, "dd/MM/yyyy"),
        type: ''+$stateParams.type,
        money_out_id: $stateParams.money_out_id,
        branch_id: $scope.branch.branch_id,
      };
    }

    function save() {
      if ($scope.myForm.$invalid) {
          $scope.msg = 'Thông tin nhập chưa đúng, vui lòng kiểm tra lại';
          $scope.formChecked = true;
          return;
      }
      var data = Object.assign({},$scope.form);  // copy object
      AppRequest.Post('cam_do/save_in', $rootScope, data,function(res){
          if(res.success){
              $location.path('/baocaongay');
          }else{
              $scope.msg = res.error.message;
          }
      });
    }
    function getMoneyOut(id){
      const data = {
        id,
        branch_id: $scope.branch.branch_id,
      }
      AppRequest.Post('cam_do/find_out', $rootScope, data, async function(res){
          if(res.success){
            $scope.money_out = res.data[0];
            if($scope.money_out.trang_thai==MONEY_OUT_STATUS.chua_tra){
              if($stateParams.type == MONEY_IN_TYPE.gia_han || $stateParams.type == MONEY_IN_TYPE.tra_gop){
                $scope.form.tien_tra = 0;
              }else{
                $scope.form.tien_tra = $scope.money_out.tien_vay;
              }
            } else {
              // get history
              await getMoneyInHistory($scope.money_out.id);
            }
            if($stateParams.type == MONEY_IN_TYPE.gia_han || $stateParams.type == MONEY_IN_TYPE.tra_gop){
              let so_ngay = 14;
              if($scope.ngay_gia_han){
                so_ngay = new Date($scope.money_out.ngay_tra_du_tinh).getTime() - new Date($scope.money_out.ngay_cam).getTime();
              }else{
                so_ngay = new Date($scope.money_out.ngay_tra_du_tinh).getTime() - new Date($scope.money_out.ngay_gia_han).getTime();
              }
              so_ngay = so_ngay/(1000*60*60*24);
              let ngay_tra_du_tinh = new Date($scope.money_out.ngay_tra_du_tinh);
              if(so_ngay<20){
                ngay_tra_du_tinh.setDate(ngay_tra_du_tinh.getDate()+14);
              }else{
                ngay_tra_du_tinh.setMonth(ngay_tra_du_tinh.getMonth()+1);
              }
              $scope.form.ngay_tra_du_tinh = $filter('date')(ngay_tra_du_tinh, "dd/MM/yyyy");
            }else{
            }
            if ($stateParams && $stateParams.id>0) {
              getMoneyIn($stateParams.id);
            }
          }else{
            $scope.msg = res.error.message;
          }
      });
    }
    function getMoneyIn(id){
      const data = {
        id,
        branch_id: $scope.branch.branch_id,
      }
      AppRequest.Post('cam_do/find_in', $rootScope, data, function(res){
          if(res.success){
              let money_in = res.data[0];
              if(money_in){
                $scope.form.tien_tra = money_in.tien_tra;
                $scope.form.id = money_in.id;
                $scope.form.tien_loi = money_in.tien_loi;
                $scope.form.ngay_tra = $filter('date')(money_in.ngay_tra, "dd/MM/yyyy");
                $scope.form.ghi_chu = money_in.ghi_chu;
              }
          }else{
              $scope.msg = res.error.message;
          }
      });
    }
    function getMoneyInHistory(money_out_id){
      const data = {
        money_out_id,
        branch_id: $scope.branch.branch_id,
      }
      AppRequest.Post('cam_do/find_in', $rootScope, data, function(res){
        if(res.success){
          $scope.money_out.history = res.data;
          $scope.tong_tien_tra_gop = 0;
          for(let h of $scope.money_out.history){
            $scope.tong_tien_tra_gop += h.tien_tra;
          }
          if($stateParams.type == MONEY_IN_TYPE.gia_han || $stateParams.type == MONEY_IN_TYPE.tra_gop){
            $scope.form.tien_tra = 0;
          }else{
            $scope.form.tien_tra = $scope.money_out.tien_vay - $scope.tong_tien_tra_gop;
          }
        }else{
          $scope.msg = res.error.message;
        }
      });
    }

}]);