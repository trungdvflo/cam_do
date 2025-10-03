angular.module('app.hanhchinh').controller('nationCnt', nationCnt);

nationCnt.$inject = ['$scope', '$rootScope', 'AppRequest','location_service', '$mdDialog'];

function nationCnt($scope, $rootScope, AppRequest, location_service, $mdDialog) {
    var self = this;
    init();

    /* private functions */
    /**
     * init values for screen (form)
     */
    function init() {
        $scope.form = {};
        $rootScope.params = {};
        nations();
    }
    // get list nation
    function nations() {
        data = {};
        // AppRequest.Post('nation/find', $rootScope, data, function (res) {
            location_service.loadNation(data, $rootScope, function (res) {
                if (res.success) {
                    $scope.data_list = res.data;
                } else {
                    $scope.msg = res.error.message;
                }
            });
        }

        $scope.showNationFormFn = function (ev, nation, key) {
            $mdDialog.show({
                    locals: {
                        nation: nation
                    },
                    controller: DialogController,
                    templateUrl: 'views/pages/hanhchinh/elements/nation_form.html',
                    parent: '#popupDialog',
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                })
                .then(function (answer) {
                    if (!answer.isEdit) {
                        $scope.data_list.unshift(answer);
                    } else {
                        $scope.data_list[key] = answer;
                    }
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        }

        function DialogController($scope, $mdDialog, nation) {
            nation.on = (nation.disable == 0);
            nation.isEdit = (true && nation && nation.country_id);
            $scope.nation = Object.assign({}, nation);

            $scope.hideFn = function () {
                $mdDialog.hide();
            };

            $scope.cancelFn = function () {
                $mdDialog.cancel();
            };
            $scope.saveFn = function () {
                if ($scope.myForm.$invalid) {
                    $scope.msg = 'Thông tin nhập chưa đúng, vui lòng kiểm tra lại';
                    $scope.formChecked = true;
                    return;
                }
                $scope.nation.disable = ($scope.nation.on) ? 0 : 1;
                var data = {
                    country_id: $scope.nation.country_id,
                    vi_name: $scope.nation.vi_name,
					country_postal_code: $scope.nation.country_postal_code,
                    disable: $scope.nation.disable
                }
                var answer = $scope.nation;
                AppRequest.Post('nation/save', $rootScope, data, function (res) {
                    if (res.success) {
                        if (!nation.isEdit) {
                            answer.country_id = res.data.insertId;
                        }
                        $mdDialog.hide(answer);
                    } else {
                        $scope.msg = res.error.message;
                    }
                });
            };
        }
    }