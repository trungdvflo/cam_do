(function () {
    'use strict';

    angular
        .module('app')
        .factory('icd_service', icd_service);

    icd_service.$inject = ['$http'];

    function icd_service($http) {
        var service = {
            loadICD: loadICD,
            loadICDChapter: loadICDChapter,
            getICDGroup: getICDGroup,
            find_ICD_by_group: find_ICD_by_group,
            getICDChapterByICD: getICDChapterByICD,
        };

        return service;

        function loadICD(data) {
            return $http({
                method: "POST",
                url: Configs.apiEndPoint + 'icd/find',
                data: data,
                headers: Configs.headerReq,
            }).then(function Success(res) {
                return res.data.data;
            });
        }

        function loadICDChapter(data) {
            return $http({
                method: "POST",
                url: Configs.apiEndPoint + 'icd10_chapter/get_all_icd_chapter',
                data: data,
                headers: Configs.headerReq,
            }).then(function Success(res) {
                return res.data;
            });
        }

        function getICDGroup(data) {
            return $http({
                method: "POST",
                url: Configs.apiEndPoint + 'icd10_group/find_ICD_group_by_chapterId',
                data: data,
                headers: Configs.headerReq,
            }).then(function Success(res) {
                return res.data;
            });
        }

        function find_ICD_by_group(data) {
            return $http({
                method: "POST",
                url: Configs.apiEndPoint + 'icd/find_ICD_by_group',
                data: data,
                headers: Configs.headerReq,
            }).then(function Success(res) {
                return res.data;
            });
        }

        function getICDChapterByICD(data) {
            return $http({
                method: "POST",
                url: Configs.apiEndPoint + 'icd/find_ICDChapter_by_icd',
                data: data,
                headers: Configs.headerReq,
            }).then(function Success(res) {
                return res.data;
            });
        }
    }
})();