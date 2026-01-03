
angular.module('app')
.controller('denHanCnt', ["$scope","$rootScope","AppRequest","$sce", "$localStorage", "$mdDialog"
, function traDoCnt($scope,$rootScope,AppRequest,$sce, $localStorage, $mdDialog) {
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

    $scope.lienHeFn = function(ev, value){
      $mdDialog.show({
          locals: {data:value},
          controller: DialogController,
          controllerAs: 'ctrl',
          templateUrl: 'views/pages/cam_do/camdo_lienhe_form.html',
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
        is_overdue: 1,
        // trang_thai: MONEY_OUT_STATUS.chua_tra,
      };
      find_out();
    }

    function find_out() {
      var data = Object.assign({},$scope.form);  // copy object
      AppRequest.Post('cam_do/find_out', $rootScope, data,function(res){
        if(res.success){
          $scope.data_out = res.data;
          for(let item of res.data){
            const d = new Date();
            const ngay_tra = new Date(item.ngay_tra_du_tinh);
            item.over_due_days = (d.getTime()-ngay_tra.getTime())/(24*60*60*1000);
            item.status_call = item.status_call? item.status_call:0;
            item.note_call  = $sce.trustAsHtml(item.note_call);
          }
        }else{
          $scope.msg = res.error.message;
        }
      });
    }
    
    function DialogController($scope, $mdDialog, $localStorage, data) {
      $scope.inputConsts = [
        {num: 0, text: 'Khách hẹn hôm nay đóng '},
        {num: 1, text: 'Khách hẹn mai đóng '},
        {num: 3, text: 'Khách hẹn 3 ngày đóng '},
        {num: 7, text: 'Khách hẹn 1 tuần đóng '},
        {num: 10, text: 'Khách hẹn ngày: '},
        {num: 0, text: 'SĐT không liên lạc được'},
        {num: 0, text: 'Khách không bắt máy'},
      ];
      $scope.branch = $localStorage.branch;
      $scope.data = data;
      $scope.hideFn = function() {
          $mdDialog.hide();
      };
      $scope.cancelFn = function() {
          $mdDialog.cancel();
      };
      $scope.inputLienHeFn = function(value) {
        let d = new Date();
        d.setDate(d.getDate()+value.num);
        $scope.data.note_call_input = value.text + d.getDate()+'/'+(d.getMonth()+1);
      }
      
      $scope.saveFn = function() {
        if ($scope.myForm.$invalid) {
          $scope.msg = 'Thông tin nhập chưa đúng, vui lòng kiểm tra lại';
          $scope.formChecked = true;
          return;
        }
        const note_call_old = data.note_call? `${data.note_call}<br/>`: '';
        const dataLH = {
          id: $scope.data.id,
          note_call: `${note_call_old}+ Lần ${data.status_call+1}: ${data.note_call_input}.`,
          status_call: data.status_call+1,
          branch_id: $scope.branch.branch_id,
        };
        AppRequest.Post('cam_do/lien_he', $rootScope, dataLH,function(res){
          if(res.success){
              $mdDialog.hide(true);
          }else{
              $scope.msg = res.error.message;
          }
        });
      };
    }
}]);