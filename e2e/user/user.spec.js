'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/signup');
    page = require('./user.po');
  });

  it('should log in and redirect to homepage', function() {
    page.name.sendKeys('thomas');
    page.email.sendKeys('t@t.com');
    page.password.sendKeys('thomas');
    page.goButton.click().then(function(){
      browser.waitForAngular();
        expect(browser.getLocationAbsUrl()).toBe('/');
    });
    browser.get('/logout');
    browser.get('/login');
    page.email.sendKeys('t@t.com');
    page.password.sendKeys('thomas');
    page.goButton.click().then(function(){
      browser.waitForAngular();
      expect(browser.getLocationAbsUrl()).toBe('/');
      expect(page.displayedName.getText()).toBe('thomas');
    });
  });



});
