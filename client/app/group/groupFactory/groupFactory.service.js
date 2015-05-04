'use strict';

angular.module('myappApp')
  .factory('groupFactory', function ($resource) {
    return $resource('/api/groups/:groupId',{groupId:'@Id'});
  });
