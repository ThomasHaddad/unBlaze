/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.name = element(by.model('user.name'));
  this.email = element(by.model('user.email'));
  this.password = element(by.model('user.password'));
  this.goButton = element(by.css('.btn-login'));
};

module.exports = new MainPage();

