angular.module('app.hanhchinh', []);
angular.module('app.hanhchinh')
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function ($stateProvider) {
    $stateProvider
      .state('quantri.hanhchinh', {
        url: "/hanhchinh",
        abstract: true,
        template: '<ui-view></ui-view>',
        ncyBreadcrumb: {
          label: 'Hành chính'
        }
      })
      
      .state('quantri.hanhchinh.career', {
        url: '/career',
        templateUrl: 'views/pages/hanhchinh/career.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([{
              serie: true,
              name: 'career',
              files: ['js/controllers/hanhchinh/career.js']
            }]);
          }],
        },
        ncyBreadcrumb: {
          label: 'Nghề nghiệp'
        }
      })
      .state('quantri.hanhchinh.nation', {
        url: '/nation',
        templateUrl: 'views/pages/hanhchinh/nation.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([{
              serie: true,
              name: 'nation',
              files: ['js/controllers/hanhchinh/nation.js']
            }]);
          }],
        },
        ncyBreadcrumb: {
          label: 'Quốc gia'
        }
      })
      .state('quantri.hanhchinh.province', {
        url: '/province',
        templateUrl: 'views/pages/hanhchinh/province.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([{
              serie: true,
              name: 'province',
              files: ['js/controllers/hanhchinh/province.js']
            }]);
          }],
        },
        ncyBreadcrumb: {
          label: 'Tỉnh thành'
        }
      })
      .state('quantri.hanhchinh.district', {
        url: '/district',
        templateUrl: 'views/pages/hanhchinh/district.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([{
              serie: true,
              name: 'district',
              files: ['js/controllers/hanhchinh/district.js']
            }]);
          }],
        },
        ncyBreadcrumb: {
          label: 'Quận huyện'
        }
      })
      .state('quantri.hanhchinh.ward', {
        url: '/ward',
        templateUrl: 'views/pages/hanhchinh/ward.html',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([{
              serie: true,
              name: 'ward',
              files: ['js/controllers/hanhchinh/ward.js']
            }]);
          }],
        },
        ncyBreadcrumb: {
          label: 'Phường xã'
        }
      })
  }]);

angular.module("app.hanhchinh").factory('hanhchinh_service', function (AppRequest) {

  var service = {
    load_province: load_province,
    load_district: load_district,
    load_ethnic_group: load_ethnic_group,
    load_nationality: load_nationality,
    loadCareers: loadCareers,
    loadNation: loadNation
  }
  return service;

  function load_province(data, $rootScope, callback) {
    var uri = 'province/find';
    AppRequest.Post(uri, $rootScope, data, callback);
  }

  function load_district(data, $rootScope, callback) {
    var uri = 'district/find';
    AppRequest.Post(uri, $rootScope, data, callback);
  }

  function load_nationality(data, $rootScope, callback) {
    var uri = 'nationality/find';
    AppRequest.Post(uri, $rootScope, data, callback);
  }

  function load_ethnic_group(data, $rootScope, callback) {
    var uri = 'ethnic_group/find';
    AppRequest.Post(uri, $rootScope, data, callback);
  }

  function loadCareers(data, $rootScope, callback) {
    var uri = 'career/find';
    AppRequest.Post(uri, $rootScope, data, callback);
  }

  function loadNation(data, $rootScope, callback) {
    var uri = 'nation/find';
    AppRequest.Post(uri, $rootScope, data, callback);
  }
});
