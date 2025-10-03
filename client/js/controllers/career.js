angular.module('app')
    .controller('careerCnt', function careerCnt($scope, $rootScope, AppRequest, $mdDialog) {
        var self = this;
        init();

        function init() {
            $scope.form = {};
            $rootScope.params = {};
            careers();
        }

        function careers() {
            data = {};
            AppRequest.Post('career/find', $rootScope, data, function (res) {
                if (res.success) {
                    $scope.data_list = res.data;
                } else {
                    $scope.msg = res.error.message;
                }
            });
        }
        $scope.showcareerFormFn = function (ev, career, key) {
            $mdDialog.show({
                    locals: {
                        career: career
                    },
                    controller: DialogController,
                    templateUrl: 'views/elements/career_form.html',
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

        function DialogController($scope, $mdDialog, career) {
            career.on = (career.disable == 0);
            career.isEdit = (true && career && career.career_id);
            $scope.career = Object.assign({}, career);

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
                $scope.career.disable = ($scope.career.on) ? 0 : 1;
                var data = {
                    career_id: $scope.career.career_id,
                    disable: $scope.career.disable,
                    vi_name: $scope.career.vi_name,
                    code: $scope.career.code,
                }
                AppDebug.log(data);
                var answer = $scope.career;
                AppRequest.Post('career/save', $rootScope, data, function (res) {
                    if (res.success) {
                        if (!career.isEdit) {
                            answer.career_id = res.data.insertId;
                        }
                        $mdDialog.hide(answer);
                    } else {
                        $scope.msg = res.error.message;
                    }
                });
            };
        }
    });