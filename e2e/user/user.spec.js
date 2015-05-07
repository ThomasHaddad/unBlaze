'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/login');
    page = require('./user.po');
  });

  it('should login and redirect to home', function() {
    page.password.sendKeys('admin');
    page.email.sendKeys('admin@admin.com');
    //page.name.sendKeys('admin');
    page.goButton.click().then(function (){
      browser.waitForAngular();
      expect(browser.getLocationAbsUrl()).toBe('/');
      expect(page.userName.getText()).toBe('Test Admin');
    })
  });
});
