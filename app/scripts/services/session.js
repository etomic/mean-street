'use strict';

angular.module('testAngularFileUploadFullstackApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
