
angular.module('app')
.controller('cam_doCnt',["$scope","$rootScope","AppRequest","$location", "$filter", "$stateParams", "$localStorage"
, function cam_doCnt($scope,$rootScope,AppRequest,$location, $filter, $stateParams, $localStorage) {
    var self = this;
    init();

    $scope.saveFn = function () {
        save();
    }
    $scope.changeTypeFn = function () {
        if($scope.form.type==0){
            let ngay_tra_du_tinh = new Date();
            ngay_tra_du_tinh.setDate(ngay_tra_du_tinh.getDate()+14);
            $scope.form.ngay_tra_du_tinh = $filter('date')(ngay_tra_du_tinh, "dd/MM/yyyy");
        }else{
            delete $scope.form.ngay_tra_du_tinh;
            if($scope.form.type==1){
                $scope.form.dien_giai = 'Tiền nhà';
            }else if($scope.form.type==2){
                $scope.form.dien_giai = 'Rút quỹ';
            }else{
                $scope.form.dien_giai = '';
            }
        }
    }
    
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.branch = $localStorage.branch;
        let ngay_cam = new Date();
        $scope.form = {
          ngay_cam: $filter('date')(ngay_cam, "dd/MM/yyyy"),
          branch_id: $scope.branch.branch_id,
        };
        if ($stateParams && $stateParams.id>0) {
            getMoneyOut($stateParams.id);
        }
    }
    function save() {
        // $location.path("/baocaongay"); return;
        if($scope.form.ngay_cam===false) {
            $scope.form.ngay_cam = "";
        }
        if ($scope.myForm.$invalid) {
            $scope.msg = 'Thông tin nhập chưa đúng, vui lòng kiểm tra lại';
            $scope.formChecked = true;
            return;
        }
        var data = Object.assign({},$scope.form);  // copy object
        AppRequest.Post('cam_do/save_out', $rootScope, data,function(res){
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
      AppRequest.Post('cam_do/find_out', $rootScope, data, function(res){
          if(res.success){
              const money_out = res.data[0];
              if(money_out){
                $scope.form.id = money_out.id;
                $scope.form.type = ''+money_out.type;
                $scope.form.ngay_cam = $filter('date')(money_out.ngay_cam, "dd/MM/yyyy");
                $scope.form.ngay_tra_du_tinh = $filter('date')(money_out.ngay_tra_du_tinh, "dd/MM/yyyy");
                $scope.form.vat_cam = money_out.vat_cam;
                $scope.form.dien_giai = money_out.dien_giai;
                $scope.form.ma_so = money_out.ma_so;
                $scope.form.model = money_out.model;
                $scope.form.tien_vay = money_out.tien_vay;
                $scope.form.nguoi_cam = money_out.nguoi_cam;
                $scope.form.id_card = money_out.id_card;
                $scope.form.ghi_chu = money_out.ghi_chu;
                $scope.form.creator = money_out.creator;
              }
          }else{
              $scope.msg = res.error.message;
          }
      });
    }

}]);