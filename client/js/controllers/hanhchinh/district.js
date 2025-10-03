angular.module('app.hanhchinh')
    .controller('districtCnt', function districtCnt($scope, $rootScope, AppRequest, $location, $mdDialog, $timeout, Excel) {
        var self = this;
        init();
        var district_data = [];
        $scope.showDistrictFormFn = function (ev, district, key) {
            $mdDialog.show({
                    locals: {
                        district: district,
                        province_id: $scope.province_id
                    },
                    controller: DialogDistrictController,
                    templateUrl: 'views/pages/hanhchinh/elements/district_form.html',
                    parent: '#popupDialog',
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                })
                .then(function (answer) {
                    if (!answer.isEdit) {
                        $scope.districts.unshift(answer);
                    } else {
                        $scope.districts[key] = answer;
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
                    district_data = res.data;
                } else {
                    $scope.msg = res.error.message;
                }
            });
        }

        function DialogDistrictController($scope, $mdDialog, district, province_id) {
            district.isEdit = (true && district && district.district_id);
            $scope.district = Object.assign({}, district);
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
                    province_id: province_id,
                    district_id: $scope.district.district_id,
					district_postal_code: $scope.district.district_postal_code,
                    vi_name: $scope.district.vi_name,
                }
                for (var i = 0; i < district_data.length; i++) {
                    if (district_data[i].vi_name === data.vi_name) {
                        $scope.msg = "Tên Quận/Huyện đã tồn tại";
                        return;
                    } else {
                        continue;
                    }
                }
    
                var answer = $scope.district;
                AppRequest.Post('district/save', $rootScope, data, function (res) {
                    if (res.success) {
                        if (!district.isEdit) {
                            answer.district_id = res.data.insertId;
                        }
                        $mdDialog.hide(answer);

                    } else {
                        $scope.msg = res.error.message;
                    }
                });
            };
        }
    });