'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl'
      });
  });
