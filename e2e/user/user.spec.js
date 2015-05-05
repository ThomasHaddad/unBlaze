'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/login');
    page = require('./user.po');
  });

  it('should log in and redirect to homepage', function() {

    page.email.sendKeys('admin@admin.com');
    page.password.sendKeys('admin');
    page.goButton.click().then(function(){
      browser.waitForAngular();
        expect(browser.getLocationAbsUrl()).toBe('/');
    });
  });
});
