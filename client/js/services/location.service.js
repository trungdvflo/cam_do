(function () {
    'use strict';

    angular
        .module('app')
        .factory('location_service', location_service);

    location_service.$inject = ['$http', 'AppRequest'];

    function location_service($http, AppRequest) {

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
    }
})();