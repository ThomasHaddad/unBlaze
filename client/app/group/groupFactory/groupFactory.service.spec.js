'use strict';

describe('Service: groupFactory', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var groupFactory;
  beforeEach(inject(function (_groupFactory_) {
    groupFactory = _groupFactory_;
  }));

  it('should do something', function () {
    expect(!!groupFactory).toBe(true);
  });

});
