angular.module('app.report', []);
angular.module('app.report').config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  // $urlRouterProvider.otherwise('/404');
  // $stateProvider.state("app.report.report_menu", {
  //   url: '/report_menu',
  //   templateUrl: 'views/pages/reports/report_menu.html',
  // });
  $stateProvider
    .state('app.report', {
      url: "/report",
      abstract: true,
      template: '<ui-view></ui-view>',
      ncyBreadcrumb: {
        label: 'Báo cáo'
      }
    })
    .state('app.report.report_menu', {
      url: '/report_menu',
      templateUrl: 'views/pages/reports/report_menu.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'report',
            files: [
                  'js/controllers/reports/report_menu.js',
                 
                  ]
          }]);
        }],
      },
      ncyBreadcrumb: {
        parent: 'app',
        label: 'Báo cáo',
      }
    })
    .state('app.report.summary', {
      url: '/summary',
      templateUrl: 'views/pages/reports/summary.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'summary',
            files: ['js/controllers/reports/summary.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Báo cáo tổng hợp'
      }
    })
    .state('app.report.chiphi', {
      url: '/chiphi',
      templateUrl: 'views/pages/reports/chiphi.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'chiphi',
            files: ['js/controllers/reports/chiphi.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Báo cáo chi phí'
      }
    })
    .state('app.report.nhaprutquy', {
      url: '/nhaprutquy',
      templateUrl: 'views/pages/reports/nhap_rut_quy.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'nhaprutquy',
            files: ['js/controllers/reports/nhap_rut_quy.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Báo cáo Nhập rút quỹ'
      }
    })
}]);