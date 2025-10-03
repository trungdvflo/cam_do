
angular.module('app')
.controller('monitorCnt', function monitorCnt($scope,$rootScope,AppRequest,$location, $mdDialog, $timeout, $filter) {
    var self = this;
    init();
    
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.status = {};
        $scope.status.dot_kham = false;
        $scope.status.shells_run = false;
        checkStatus();
    }
    function checkStatus() {
        if(!isMonitor()) return; // tranh chay qua mh khac
        var data = {};
        AppRequest.Post('monitor/status', $rootScope, data,function(res){
            if(res.success){
                $scope.status = res.data;
            }else{
                $scope.msg = res.error.message;
            }
            $timeout(checkStatus, 30*1000);
        });
    }
    function isMonitor(){
        var path = $location.path();
        var pathArr = path.split("/");
        if ( pathArr[2] === 'monitor') {
            return true;
        }else{
            return false;
        }
    }
});