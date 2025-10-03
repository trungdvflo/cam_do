angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {
    $stateProvider
    
    // other-khac
    .state('quantri.other', {
        url: "/other",
        abstract: true,
        template: '<ui-view></ui-view>',
        ncyBreadcrumb: {
          label: 'Khác'
        }
      })/*
      .state('appother', {
        url: "/other",
        abstract: true,
        templateUrl: 'views/common/layouts/quantri.html',
        resolve: {
          loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
            // you can lazy load CSS files
            return $ocLazyLoad.load([{
              serie: true,
              name: 'Font Awesome',
              files: ['css/font-awesome.min.css']
            }, {
              serie: true,
              name: 'Simple Line Icons',
              files: ['css/simple-line-icons.css']
            }]);
          }]
        },
        ncyBreadcrumb: {
          label: 'Khác'
        }
      })*/
      .state('quantri.other.config_system', {
        url: '/config_system',
        templateUrl: 'views/pages/others/config_system.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([{
              serie: true,
              name: 'config_system',
              files: ['js/controllers/others/other.js']
            }]);
          }],
        },
        ncyBreadcrumb: {
          label: 'Cấu hình hệ thống'
        }
      })
      .state('quantri.other.comp_alert', {
        url: '/comp_alert',
        templateUrl: 'views/pages/others/comp_alert.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([{
              serie: true,
              name: 'comp_alert',
              files: ['js/controllers/others/comp_alert.js']
            }]);
          }],
        },
        ncyBreadcrumb: {
          label: 'Thông báo'
        }
      })
      .state('quantri.other.shell', {
        url: '/shell',
        templateUrl: 'views/pages/others/shell.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([{
              serie: true,
              name: 'shell',
              files: ['js/controllers/others/shell.js']
            }]);
          }],
        },
        ncyBreadcrumb: {
          label: 'Shell Schedule'
        }
      })
      .state('quantri.other.monitor', {
        url: '/monitor',
        templateUrl: 'views/pages/others/monitor.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([{
              serie: true,
              name: 'monitor',
              files: ['js/controllers/others/monitor.js']
            }]);
          }],
        },
        ncyBreadcrumb: {
          label: 'Shell Schedule'
        }
      })
      // end other
}]);