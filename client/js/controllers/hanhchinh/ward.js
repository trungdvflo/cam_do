angular.module('app.hanhchinh')
    .controller('wardCnt', function wardCnt($scope, $rootScope, AppRequest, $location, $mdDialog, $timeout, Excel) {
        var self = this;
        init();
        var ward_list = {};
        $scope.showWardFormFn = function (ev, ward, key) {
            $mdDialog.show({
                    locals: {
                        ward: ward,
                        district_id: $scope.district_id,
                    },
                    controller: DialogController,
                    templateUrl: 'views/pages/hanhchinh/elements/ward_form.html',
                    parent: '#popupDialog',
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                })
                .then(function (answer) {
                    if (!answer.isEdit) {
                        $scope.wards.unshift(answer);
                    } else {
                        $scope.wards[key] = answer;
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
            get_provinces();
        }

        function get_provinces() {
            data = {};
            AppRequest.Post('province/find', $rootScope, data, function (res) {
                if (res.success) {
                    $scope.provinces = res.data;
                } else {
                    $scope.msg = res.error.message;
                }
            });
        }

        $scope.getDistrictByProvinceId = function (id) {
            data = {};
            AppRequest.Post('district/getDistrictByProvinceId/' + id, $rootScope, data, function (res) {
                if (res.success) {
                    $scope.districts = res.data;
                    $scope.province_id = id;

                } else {
                    $scope.msg = res.error.message;
                }
            });
        }

        $scope.getWardByDistrictId = function (id) {
            data = {};
            AppRequest.Post('ward/getWardByDistrictId/' + id, $rootScope, data, function (res) {
                if (res.success) {
                    $scope.wards = res.data;
                    $scope.district_id = id;
                    ward_list = res.data;
                } else {
                    $scope.msg = res.error.message;
                }
            });
        }

        function DialogController($scope, $mdDialog, ward, district_id) {
            ward.isEdit = (true && ward && ward.ward_id);
            $scope.ward = Object.assign({}, ward);
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
                var data = {
                    district_id: district_id,
                    ward_id: $scope.ward.ward_id,
                    vi_name: $scope.ward.vi_name,
					ward_postal_code: $scope.ward.ward_postal_code,
                    auto_suggest_code: $scope.ward.auto_suggest_code
                }
                AppDebug.log(data);
                var answer = $scope.ward;
                AppRequest.Post('ward/save', $rootScope, data, function (res) {
                    if (res.success) {
                        if (!ward.isEdit) {
                            answer.ward_id = res.data.insertId;
                        }
                        $mdDialog.hide(answer);
                    } else {
                        $scope.msg = res.error.message;
                    }
                });
            };
        }
    });