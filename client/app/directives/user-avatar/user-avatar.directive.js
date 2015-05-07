'use strict';

angular.module('myappApp')
  .directive('userAvatar',['md5', function (md5) {
    return {
      template: '<img src="//gravatar.com/avatar/{{gid}}?d=identicon{{size}}"/>',
      replace: true,
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.gid = md5.createHash(attrs.email);
        scope.size = attrs.size ? "&s=" + attrs.size : "";
      }
    };
  }]);
