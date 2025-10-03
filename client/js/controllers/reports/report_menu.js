
angular.module('app.report').controller('report_menuCnt', report_menuCnt);
function report_menuCnt($scope) {
    var self = this;
    $scope.report_title = "Báo cáo tài chính"
    init();
    $scope.hideAllFn = function () {
        $scope.hideAll = !$scope.hideAll;
        $scope.hideBCTC = $scope.hideAll;
        $scope.hideBHYT = $scope.hideAll;
        $scope.hideBCHD = $scope.hideAll;
        $scope.hideBCD = $scope.hideAll;
        $scope.hideBCK = $scope.hideAll;
    }

    function init() {}
};
