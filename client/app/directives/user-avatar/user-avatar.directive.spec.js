'use strict';

describe('Directive: directives/userAvatar', function () {

  // load the directive's module and view
  beforeEach(module('myappApp'));
  beforeEach(module('app/directives/user-avatar/directives/user-avatar.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<directives/user-avatar></directives/user-avatar>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the directives/userAvatar directive');
  }));
});