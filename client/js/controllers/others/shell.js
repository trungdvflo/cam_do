
angular.module('app')
.controller('shellCnt', function shellCnt($scope,$rootScope,AppRequest,$location, $mdDialog, $timeout, $filter) {
    var self = this;
    init();
    
    $scope.findFn = function(){
        find();
    }
    $scope.btnRunFn = function(){
        var data = {};
        AppRequest.Post('shell/run_shells_run', $rootScope, data,function(res){
            if(res.success){
                $scope.is_shells_run = true;
            }
        });
    }
    $scope.btnStopFn = function(){
        var data = {};
        AppRequest.Post('shell/stop_shells_run', $rootScope, data,function(res){
            if(res.success){
                $scope.is_shells_run = false;
            }
        });
    }
    $scope.selectAllShellFn = function(ev){
        for(let d of $scope.data_list){
            d.selected = !$scope.selecteAll;
        }
        $scope.hasSelected = !$scope.selecteAll;
    }
    $scope.selectShellFn = function(ev, value){
        var tmp = false;
        for(let d of $scope.data_list){
            if(d.id==value.id) continue; // ko kiem tra cai dang chon
            if(d.selected){
                tmp = d.selected;
                break;
            }
        }
        if(!tmp) tmp = !value.selected; // vi gia tri chua thay doi
        $scope.hasSelected = tmp;
    }
    $scope.showShellFormFn = function(ev, shell, key){
        if(!shell){
            key = 0;
            for(let i=0; i<$scope.data_list.length; i++){
                if($scope.data_list[i].selected){
                    key=i;
                    shell=$scope.data_list[i];
                    break;
                }
            }
        }
        $mdDialog.show({
            locals: {shell: shell},
            controller: DialogController,
            controllerAs: 'ctrl',
            templateUrl: 'views/pages/others/elements/shell_form.html',
            //parent: angular.element(document.body),
            parent: '#popupDialog',
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
            if(!answer.isEdit){
                // add user
                $scope.data_list.unshift(answer);
            }else{
                // update group id
                $scope.data_list[key] = answer;
            }
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    }
    
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.is_shells_run = false;
        find();
        check_shells_run();
    }
    function check_shells_run(){
        if(!isShell()) return; // tranh chay qua mh khac
        var data = {};
        AppRequest.Post('shell/check_shells_run', $rootScope, data,function(res){
            if(res.success){
                $scope.is_shells_run = (res.data=='active');
                $timeout(check_shells_run, 60*1000);
            }
        });
    }
    function find() {
        var data = {};
        AppRequest.Post('shell/find', $rootScope, data,function(res){
            if(res.success){
                $scope.data_list = res.data;
                $timeout(countDownTime, 1000);
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
    function countDownTime(){
        if(!isShell()) return; // tranh chay qua mh khac
        if($scope.is_shells_run){
            var now = new Date().getTime();
            $('.countdown_time').each(function( index ) {
                var t = new Date($( this ).attr('title')).getTime() - now;
                if(t<-1500){
                    $(this).text($filter('date')(new Date($( this ).attr('title')), 'dd/MM HH:mm'));
                }else if(t<0){
                    // reload
                }else if(t<1500){
                    $(this).text('running');
                }else{
                    t = Math.floor(t/1000)
                    var m = Math.floor(t / 60);
                    var s = t % 60;
                    $(this).text(m+':'+s);
                }
            });
            $timeout(countDownTime, 1000);
        }else{
            $timeout(countDownTime, 1000);
        }
    }
    function isShell(){
        var path = $location.path();
        var pathArr = path.split("/");
        if ( pathArr[2] === 'shell') {
            return true;
        }else{
            return false;
        }
    }

    function DialogController($scope, $mdDialog, $filter, shell) {
        var t = this;
        shell.on = (shell.status=='active');
        shell.isEdit = (true && shell && shell.id);
        shell.start_time = shell.start_time || new Date();
        shell.start_time_h = $filter('date')(shell.start_time, 'HH');
        shell.start_time_m = $filter('date')(shell.start_time, 'mm');
        shell.start_time = $filter('date')(shell.start_time, 'dd/MM/yyyy');
        $scope.shell = Object.assign({}, shell);

        $scope.hideFn = function() {
            $mdDialog.hide();
        };
    
        $scope.cancelFn = function() {
            $mdDialog.cancel();
        };
        
        $scope.saveFn = function() {
            if ($scope.myForm.$invalid) {
                $scope.msg = 'Thông tin nhập chưa đúng, vui lòng kiểm tra lại';
                $scope.formChecked = true;
                return;
            }
            $scope.shell.status = ($scope.shell.on)? 'active': 'pause';
            var answer = $scope.shell;
            AppRequest.Post('shell/save', $rootScope, answer,function(res){
                if(res.success){
                    if(!shell.isEdit){
                        $scope.shell.shell_id = res.data.insertId;
                        answer.shell_id = res.data.insertId;
                    }
                    $mdDialog.hide(answer);
                    AppDebug.log(answer);
                }else{
                    $scope.msg = res.error.message;
                }
            });
        };
    }
});