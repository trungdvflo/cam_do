// Default colors
var brandPrimary =  '#20a8d8';
var brandSuccess =  '#4dbd74';
var brandInfo =     '#63c2de';
var brandWarning =  '#f8cb00';
var brandDanger =   '#f86c6b';

var grayDark =      '#2a2c36';
var gray =          '#55595c';
var grayLight =     '#818a91';
var grayLighter =   '#d1d4d7';
var grayLightest =  '#f8f9fa';

var app = angular.module('app', [
  'ui.router',
  'oc.lazyLoad',
  'ncy-angular-breadcrumb',
  'angular-loading-bar',
  'ngStorage',
  'ngMaterial',
  'ngFileUpload',
  'app.report',
  'app.hanhchinh'
])
.config(['cfpLoadingBarProvider','$httpProvider', function(cfpLoadingBarProvider, $httpProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.latencyThreshold = 1;
  $httpProvider.useApplyAsync(true);
}])
.run(['$rootScope', '$state', '$stateParams', '$transitions', '$localStorage', '$locale', function($rootScope, $state, $stateParams, $transitions, $localStorage, $locale) {
  $rootScope.$on('$stateChangeSuccess',function(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  $transitions.onSuccess({}, function(transition) {
    if(transition.to().name != 'appSimple.login' && transition.to().name != 'appSimple.change_pass'
        && transition.to().name != 'app.loading-page')
    {
      if($localStorage.user){
        var param = ''
        if($stateParams){
          for(let key in $stateParams){
            if ($stateParams.hasOwnProperty(key)&&$stateParams[key]!=null&&$stateParams[key]!='null') {
              param = '|' + key + ':' + $stateParams[key]
            }
          }
        }
        $localStorage.transition_to = $localStorage.user.uinfo.username + '|' + transition.to().name + param;
      }
    }
  });
  $rootScope.$state = $state;
  if(!$rootScope.$userkey){
    //$rootScope.$userkey = $cookies.get('userkey');
    $rootScope.$userkey = $localStorage.userkey;
  }
  if(!$rootScope.user){
    $rootScope.user = $localStorage.user;
  }
  //var sidebar = $cookies.get('sidebar-minimized');
  var sidebar = $localStorage.sidebar_minimized;
  if(sidebar == 'sidebar-minimized'){
    angular.element('body').toggleClass('sidebar-minimized');
  }
  
  angular.element("#sysError").removeClass("d-none"); 
  return $rootScope.$stateParams = $stateParams;
}]);
app.config(function($mdAriaProvider) {
  // Globally disables all ARIA warnings.
  $mdAriaProvider.disableWarnings();
});

app.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('altTheme')
      .primaryPalette('grey')
  $mdThemingProvider.setDefaultTheme('altTheme');
});

app.factory('Excel',function($window){
  var uri='data:application/vnd.ms-excel;base64,',
      template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
      format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
  return {
      tableToExcel:function(tableId,worksheetName){
          if(!worksheetName) worksheetName = 'worksheetName'
          var table=document.querySelector(tableId),
              ctx={worksheet:worksheetName,table:table.innerHTML},
              href=uri+base64(format(template,ctx));
          return href;
      }
  };
})

angular.lowercase = text => text.toLowerCase();
angular.uppercase = text => text.toUpperCase();
