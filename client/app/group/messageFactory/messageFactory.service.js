'use strict';

angular.module('myappApp')
  .factory('messageFactory', function ($resource) {
    return $resource('/api/messages/:id',{id:'@Id'});
  });
