'use strict';

angular.module('myappApp')
  .factory('groupFactory', function ($resource) {
    console.log('factory groupFactory');
    return $resource('/api/groups/:groupId',{groupId:'@Id'});
  });
