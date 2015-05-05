'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var userFixture = require('../user/user.fixtures');

var users;
describe('GET /api/groups', function() {


  before(function(done) {
    userFixture.createUsers(done);
  });

  it('should respond with JSON array', function(done) {
    users = userFixture.getUsers();
    request(app)
      .post('/auth/local')
      .send({ email: users[0].email, password: users[0].password })
      .expect(200)
      .end(function(err, res) {
        if ( err ) throw err;
        request(app)
          .get('/api/groups')
          .set('Authorization', 'Bearer ' + res.body.token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            done();
          });
      });
  });

  it('should respond with 401', function(done) {

    request(app)
      .get('/api/groups')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
