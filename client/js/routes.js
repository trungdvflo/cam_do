
app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider'
, function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

  $urlRouterProvider.otherwise('/login');

  $ocLazyLoadProvider.config({
    debug: Configs.debugLazyLoad
  });

  $breadcrumbProvider.setOptions({
    prefixStateName: 'app.main',
    includeAbstract: true,
    template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
  });

  $stateProvider.state('app', {
      abstract: true,
      templateUrl: 'views/common/layouts/full.html',
      //page title goes here
      ncyBreadcrumb: {
        label: 'Root',
        skip: true
      },
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
        }],
        loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
          // you can lazy load files for an existing module
          return $ocLazyLoad.load([{
            serie: true,
            name: 'chart.js',
            files: [
              'bower_components/chart.js/dist/Chart.min.js',
              'bower_components/angular-chart.js/dist/angular-chart.min.js'
            ]
          }]);
        }],
      }
    })
    .state('app.loading-page', {
      url: '/loading-page',
      templateUrl: 'views/common/loading-page.html'
    })
    .state('app.main', {
      url: '/dashboard',
      templateUrl: 'views/main.html',
      //page title goes here
      ncyBreadcrumb: {
        label: 'Trang chủ',
      },
      //page subtitle goes here
      params: {
        subtitle: 'Welcome to ROOT powerfull Bootstrap & AngularJS UI Kit'
      },
      resolve: {
        loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
          // you can lazy load files for an existing module
          return $ocLazyLoad.load([{
            serie: true,
            name: 'chart.js',
            files: [
              'bower_components/chart.js/dist/Chart.min.js',
              'bower_components/angular-chart.js/dist/angular-chart.min.js'
            ]
          }, ]);
        }],
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          // you can lazy load controllers
          return $ocLazyLoad.load({
            files: ['js/controllers/main.js']
          });
        }]
      }
    })
    

    .state('appSimple', {
      abstract: true,
      templateUrl: 'views/common/layouts/simple.html',
      resolve: {
        loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
          // you can lazy load files for an existing module
          return $ocLazyLoad.load([{
            serie: true,
            name: 'Font Awesome',
            files: ['css/font-awesome.min.css']
          }, {
            serie: true,
            name: 'Simple Line Icons',
            files: ['css/simple-line-icons.css']
          }]);
        }],
      }
    })
    // Additional Pages
    .state('appSimple.login', {
      url: '/login',
      templateUrl: 'views/pages/login.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          // you can lazy load files for an existing module
          return $ocLazyLoad.load([{
            serie: true,
            name: 'LoginCnt',
            files: ['js/controllers/login.js']
          }]);
        }],
      }
    })
    .state('appSimple.slogin', {
      url: '/slogin',
      templateUrl: 'views/pages/login.html',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          // you can lazy load files for an existing module
          return $ocLazyLoad.load([{
            serie: true,
            name: 'LoginCnt',
            files: ['js/controllers/slogin.js']
          }]);
        }],
      }
    })
    .state('appSimple.change_pass', {
      url: '/user/change_pass',
      templateUrl: 'views/pages/change_pass.html'
    })
    .state('appSimple.register', {
      url: '/register',
      templateUrl: 'views/pages/register.html'
    })
    .state('appSimple.404', {
      url: '/404',
      templateUrl: 'views/pages/404.html'
    })
    .state('appSimple.500', {
      url: '/500',
      templateUrl: 'views/pages/500.html'
    })

    .state('quantri', {
      abstract: true,
      ncyBreadcrumb: {
        label: 'Root',
        skip: true
      },
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
      }
    })

}]);
