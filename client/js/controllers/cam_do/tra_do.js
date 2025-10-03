
angular.module('app')
.controller('traDoCnt', ["$scope","$rootScope","AppRequest","$location", "$localStorage", "$mdDialog", "$sce"
, function traDoCnt($scope,$rootScope,AppRequest,$location, $localStorage, $mdDialog, $sce) {
    var self = this;
    init();
    
    $scope.findFn = function(){
        find_out();
    }
    $scope.sortFn = function(){
      if($scope.form.sort!='ngay_tra_du_tinh'){
        $scope.form.sort = 'ngay_tra_du_tinh';
      }else{
        $scope.form.sort = 'ngay_cam';
      }
      find_out();
    }

    $scope.processFn = function(event, value){
      moneyInProcess(value, '');
    }
    $scope.traFn = function(event, value){
      moneyInProcess(value, MONEY_IN_TYPE.tra_do);
    }
    $scope.traGopFn = function(event, value){
      moneyInProcess(value, MONEY_IN_TYPE.tra_gop);
    }
    $scope.giaHanFn = function(event, value){
      moneyInProcess(value, MONEY_IN_TYPE.gia_han);
    }
    $scope.thanhLyFn = function(event, value){
      moneyInProcess(value, MONEY_IN_TYPE.thanh_ly);
    }
    $scope.showMoneyInFn = function(event, value){
      loadMoneyIn(value);
    }
    $scope.ghiChuFn = function(ev, value){
      $mdDialog.show({
          locals: {data:value},
          controller: DialogController,
          controllerAs: 'ctrl',
          templateUrl: 'views/pages/cam_do/camdo_note_form.html',
          //parent: angular.element(document.body),
          parent: angular.element(document.getElementById('popupDialog')),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          if(answer){
            $scope.findFn();
          }
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    }
    
    $scope.SetPage = function(page){        
        $scope.paging.current_page = page;
        paging_out(page);
    }
    $scope.FirstPage = function(){        
        $scope.paging.current_page = 1;
        paging_out(1);
    }
    $scope.EndPage = function(){        
        $scope.paging.current_page = $scope.paging.total_page;
        paging_out($scope.paging.current_page);
    }
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
      $scope.branch = $localStorage.branch;
      $scope.form = {
        type: MONEY_OUT_TYPE.cam_do,
        money_out_open: 1,    // chua tra, chua thanh_ly
        branch_id: $scope.branch.branch_id,
        sort: 'ngay_tra_du_tinh',
      };
      if($location.$$path === "/da_tra"){
        $scope.form.money_out_open = 0; // da tra, da thanh ly
        $scope.paging = {
          page: 1
        };
        paging_out(1);
      }else{
        delete $scope.paging;
        find_out();
      }
    }

    function find_out() {
      var data = Object.assign({},$scope.form);  // copy object
      AppRequest.Post('cam_do/find_out', $rootScope, data,function(res){
        if(res.success){
          $scope.data_out = res.data;
          $scope.tong_chi = 0;
          $scope.over_due = 0;
          for(let item of res.data){
            $scope.tong_chi += item.tien_vay;
            const d = new Date();
            const ngay_tra = new Date(item.ngay_tra_du_tinh);
            if(ngay_tra < d){
              item.over_due = 1;
              $scope.over_due++;
              item.over_due_days = (d.getTime()-ngay_tra.getTime())/(24*60*60*1000);
            }
            item.note_call  = $sce.trustAsHtml(item.note_call);
          }
        }else{
            $scope.msg = res.error.message;
        }
      });
    }
    function paging_out(page) {
      var data = Object.assign({},$scope.form);  // copy object
      data.page = page;
      AppRequest.Post('cam_do/find_out', $rootScope, data,function(res){
        if(res.success){
          $scope.data_out = res.data.data_list;
          $scope.tong_chi = 0;
          for(let item of $scope.data_out){
            $scope.tong_chi += item.tien_vay;
            if(new Date(item.ngay_tra_du_tinh)<new Date()){
              item.over_due = 1;
            }
          }
          var paging = res.data.paging;
          $scope.paging = Utils.pagingCalculator(paging);
          $scope.start_record = paging.row_per_page*(paging.current_page-1)+1;
        }else{
            $scope.msg = res.error.message;
        }
      });
    }

    function loadMoneyIn(value){
      var data = {
        money_out_id: value.id,
        branch_id: $scope.branch.branch_id,
      }
      AppRequest.Post('cam_do/find_in', $rootScope, data,function(res){
          if(res.success){
              value.gia_han_infos = res.data;
          }else{
              $scope.msg = res.error.message;
          }
      });
    }

    function moneyInProcess(value, type){
      $location.path('/money_in/' + type + '/' + value.id + '/');
    }

    
    function DialogController($scope, $mdDialog, $localStorage, data) {
      $scope.branch = $localStorage.branch;
      $scope.data = data;
      $scope.hideFn = function() {
          $mdDialog.hide();
      };
  
      $scope.cancelFn = function() {
          $mdDialog.cancel();
      };
      
      $scope.saveFn = function() {
        const data = {
          id: $scope.data.id,
          ghi_chu: $scope.data.ghi_chu,
          branch_id: $scope.branch.branch_id,
        };
        AppRequest.Post('cam_do/ghi_chu', $rootScope, data,function(res){
          if(res.success){
              $mdDialog.hide(true);
          }else{
              $scope.msg = res.error.message;
          }
        });
      };
    }
}]);