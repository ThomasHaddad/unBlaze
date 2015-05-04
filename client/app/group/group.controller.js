'use strict';

angular.module('myappApp')
  .controller('GroupCtrl', function ($scope, socket, Auth, groups) {
    $scope.group = groups;
    var user = Auth.getCurrentUser();
    var tag = 'group_'+user._id;
    socket.syncUpdates(tag, $scope.group);

  });
