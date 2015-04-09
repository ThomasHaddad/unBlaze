
'use strict';

angular.module('myappApp')
  .controller('GroupCtrl', function ($scope,groups) {
    $scope.groups=groups;
    $scope.message = 'Hello';

  });
