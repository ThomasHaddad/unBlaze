'use strict';

var User = require('./user.model');
var async = require('async');


var users = [];
exports.createUsers = function(done) {
  var user1 = {
    provider: 'local',
    name: 'Fake User 1',
    email: 'test1@test.com',
    password: 'password'
  };
  var user2 = {
    provider: 'local',
    name: 'Fake User 2',
    email: 'test2@test.com',
    password: 'password'
  };
  User.remove().exec().then(function() {
    async.parallel([
        function(callback) {
          User.create(user1, function(err, user) {
            if ( err ) return done(err);
            callback(null, user);
          });
        },
        function(callback) {
          User.create(user2, function(err, user) {
            if ( err ) return done(err);
            callback(null, user);
          });
        }],
      function(err, result) {
        users = result;
        done(err);
      }
    );
  })
};
exports.getUsers = function() {
  return users;
};
