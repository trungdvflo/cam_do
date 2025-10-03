
angular.module('app')
.controller('otherCnt', function otherCnt($scope,$rootScope,AppRequest,$location) {
    var self = this;
    init();
    
    
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){

    }
    
    
})
.controller('config_systemCnt', function config_systemCnt($scope,$rootScope,AppRequest,$timeout) {
    var self = this;
    init();
    
    $scope.confCheckBHYTFn = function(val){
        var data = {
            allow_no_check_bhyt: val
        }
        AppRequest.Post('config_system/save_conf_check_bhyt', $rootScope, data,function(res){
            loadNoCheckBHYT();
        });
    }
    $scope.saveConfFn = function(conf){
        delete conf.msgSucc;
        delete conf.msgFail;
        AppRequest.Post('config_system/save_configs', $rootScope, conf,function(res){
            if(res.success){
                conf.msgSucc = res.error.message;
                $timeout(function(){
                    delete conf.msgSucc;
                }, 3000);
            }else{
                conf.msgFail = res.error.message;
            }
            
        });
    }
    
    /* private functions */
    /**
     * init values for screen (form)
     */
    function init(){
        $scope.allow_no_check_bhyt = 'OFF';
        loadNoCheckBHYT();
        loadConfigs();
    }
    function loadNoCheckBHYT(){
        data = {};
        AppRequest.Post('config_system/load_check_bhyt', $rootScope, data,function(res){
            console.log(res)
            if(res.success){
                $scope.allow_no_check_bhyt = res.data
            }else{
                $scope.allow_no_check_bhyt = 'OFF';
                $scope.msg = res.error.message;
            }
        });
    }
    function loadConfigs(){
        data = {};
        AppRequest.Post('config_system/load_configs', $rootScope, data,function(res){
            if(res.success){
                var data_list = res.data;
                $scope.groupConf = [];
                var group = {};
                for(var i in data_list){
                    if(group.type != data_list[i].type || group.vi_type != data_list[i].vi_type ){
                        var new_group = {
                            type: data_list[i].type, 
                            vi_type: data_list[i].vi_type,
                            configs: []
                        }
                        group = {
                            type: data_list[i].type, 
                            vi_type: data_list[i].vi_type
                        }
                        if(group.type){
                            $scope.groupConf.push(new_group);
                        }
                    }
                    new_group.configs.push(data_list[i]);
                }
            }else{
                $scope.msg = res.error.message;
            }
        });
    }
})