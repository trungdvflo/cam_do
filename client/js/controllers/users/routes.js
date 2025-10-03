angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {
    $stateProvider
    
    .state('quantri.user', {
      url: "/user",
      abstract: true,
      template: '<ui-view></ui-view>',
      ncyBreadcrumb: {
        label: 'Người dùng'
      }
    })/*
    .state('appuser', {
      url: "/user",
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
        label: 'Người dùng'
      }
    })*/
    .state('quantri.user.management', {
      url: '/management',
      templateUrl: 'views/pages/users/user.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'user',
            files: ['js/controllers/users/user.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Quản lý người dùng'
      }
    })
    .state('quantri.user.group', {
      url: '/group',
      templateUrl: 'views/pages/users/user_group.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'user_group',
            files: ['js/controllers/users/user_group.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Quản lý nhóm người dùng'
      }
    })
    .state('quantri.user.employee', {
      url: '/employee',
      templateUrl: 'views/pages/users/employee.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'employee',
            files: ['js/controllers/users/employee.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Quản lý nhân viên'
      }
    })
    .state('quantri.user.permission', {
      url: '/permission',
      templateUrl: 'views/pages/users/permission.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'permission',
            files: ['js/controllers/users/permission.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Phân quyền người dùng'
      }
    })
    .state('quantri.user.group_permission', {
      url: '/group_permission',
      templateUrl: 'views/pages/users/group_permission.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'group_permission',
            files: ['js/controllers/users/group_permission.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Quyền nhóm người dùng'
      }
    })
    .state('quantri.user.permission_management', {
      url: '/permission_management',
      templateUrl: 'views/pages/users/permission_management.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([{
            serie: true,
            name: 'user',
            files: ['js/controllers/users/permission_management.js']
          }]);
        }],
      },
      ncyBreadcrumb: {
        label: 'Quản lý quyền'
      }
    })
  }]);