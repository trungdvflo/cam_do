angular.module('app')
.config(["$stateProvider", "$urlRouterProvider", "$ocLazyLoadProvider", "$breadcrumbProvider", function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {
    $stateProvider
    // branch
    .state('app.branch', {
      url: '/branch',
      templateUrl: 'views/pages/rooms/branch_management.html',
      resolve: {
        loadMyCtrl: ["$ocLazyLoad", function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'branch_management',
            files: ['js/controllers/rooms/branch_management.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'DS cơ sở'
      }
    })
    .state('app.department', {
      url: '/department',
      templateUrl: 'views/pages/rooms/branch_department.html',
      resolve: {
        loadMyCtrl: ["$ocLazyLoad", function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'branch_department',
            files: ['js/controllers/rooms/branch_department.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'DS khoa'
      }
    })
}]);