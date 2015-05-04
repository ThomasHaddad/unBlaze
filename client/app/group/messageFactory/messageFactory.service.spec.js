'use strict';

describe('Service: messageFactory', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var messageFactory;
  beforeEach(inject(function (_messageFactory_) {
    messageFactory = _messageFactory_;
  }));

  it('should do something', function () {
    expect(!!messageFactory).toBe(true);
  });

});
