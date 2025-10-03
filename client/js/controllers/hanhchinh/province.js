angular.module('app.hanhchinh').controller('provinceCnt', provinceCnt);

provinceCnt.$inject = ['$scope', '$rootScope', 'AppRequest', 'location_service', '$mdDialog'];

function provinceCnt($scope, $rootScope, AppRequest, location_service, $mdDialog) {
    var self = this;
    init();
    var province_data;
    $scope.showprovinceFormFn = function (ev, province, key) {
        $mdDialog.show({
                locals: {
                    province: province
                },
                controller: DialogController,
                templateUrl: 'views/pages/hanhchinh/elements/province_form.html',
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

    /* private functions */
    /**
     * init values for screen (form)
     */
    function init() {
        $scope.form = {};
        $rootScope.params = {};
        provinces();
    }

    function provinces() {
        data = {};
        location_service.load_province(data, $rootScope, function (res) {
            if (res.success) {
                $scope.data_list = res.data;
                province_data = res.data;
            } else {
                $scope.msg = res.error.message;
            }
        });
    }

    function DialogController($scope, $mdDialog, province) {
        province.on = (province.disable == 0);
        province.isEdit = (true && province && province.province_id);
        $scope.province = Object.assign({}, province);

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

            $scope.province.disable = ($scope.province.on) ? 0 : 1;
            var data = {
                province_id: $scope.province.province_id,
				province_postal_code: $scope.province.province_postal_code,
                vi_name: $scope.province.vi_name,
            }
            for (var i = 0; i < province_data.length; i++) {
                if (province_data[i].vi_name === data.vi_name) {
                    $scope.msg = "Tỉnh thành đã tồn tại";
                    return;
                } else {
                    continue;
                }
            }
            AppDebug.log(data);
            var answer = $scope.province;
            AppRequest.Post('province/save', $rootScope, data, function (res) {
                if (res.success) {
                    if (!province.isEdit) {
                        answer.province_id = res.data.insertId;
                    }
                    $mdDialog.hide(answer);
                } else {
                    $scope.msg = res.error.message;
                }
            });
        };
    }
}