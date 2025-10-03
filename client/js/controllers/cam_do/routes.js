angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {
    $stateProvider
    .state('app.camdo', {
      url: '/camdo/:id',
      templateUrl: 'views/pages/cam_do/cam_do.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'cam_do',
            files: ['js/controllers/cam_do/cam_do.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Nhận cầm đồ'
      }
    })
    .state('app.money_in', {
      url: '/money_in/:type/:money_out_id/:id',
      templateUrl: 'views/pages/cam_do/money_in.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'money_in',
            files: ['js/controllers/cam_do/money_in.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Thu tiền nhập quỹ'
      }
    })
    .state('app.trado', {
      url: '/trado',
      templateUrl: 'views/pages/cam_do/tra_do.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'tra_do',
            files: ['js/controllers/cam_do/tra_do.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Trả đồ / Gia hạn / Thanh lý'
      }
    })
    .state('app.da_tra', {
      url: '/da_tra',
      templateUrl: 'views/pages/cam_do/tra_do.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'tra_do',
            files: ['js/controllers/cam_do/tra_do.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Đã trả'
      }
    })
    .state('app.den_han', {
      url: '/den_han',
      templateUrl: 'views/pages/cam_do/den_han.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'den_han',
            files: ['js/controllers/cam_do/den_han.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Đến hạn cần xử lý'
      }
    })
    .state('app.baocaongay', {
      url: '/baocaongay',
      templateUrl: 'views/pages/cam_do/bao_cao_ngay.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'bao_cao_ngay',
            files: ['js/controllers/cam_do/bao_cao_ngay.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Báo cáo thu chi trong ngày'
      }
    })
    .state('app.salary', {
      url: '/salary',
      templateUrl: 'views/pages/salary/salary.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'salary',
            files: ['js/controllers/salary/salary.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Thù lao'
      }
    })
  }]);