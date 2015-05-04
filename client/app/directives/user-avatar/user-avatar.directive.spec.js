'use strict';

describe('Directive: directives/userAvatar', function () {

  // load the directive's module and view
  beforeEach(module('myappApp'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should display avatar image', inject(function ($compile) {
    element = angular.element('<user-avatar email="admin@admin.com"></user-avatar>');
    element = $compile(element)(scope);
    scope.$digest();

    expect(element.attr('src')).toBe('//gravatar.com/avatar/64e1b8d34f425d19e1ee2ea7236d3028?d=identicon');
  }));

  it('should display avatar image of 40px', inject(function ($compile) {
    element = angular.element('<user-avatar email="admin@admin.com" size="40"></user-avatar>');
    element = $compile(element)(scope);
    scope.$digest();

    expect(element.attr('src')).toBe('//gravatar.com/avatar/64e1b8d34f425d19e1ee2ea7236d3028?d=identicon&s=40');
  }));
});
