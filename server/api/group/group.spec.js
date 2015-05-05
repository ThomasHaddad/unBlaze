'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var userFixture = require('../user/user.fixtures');
var User = require('../user/user.model');

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

describe('POST /api/groups', function() {


  before(function(done) {
    userFixture.createUsers(done);
  });

  it('should respond with JSON object', function(done) {
    users = userFixture.getUsers();
    request(app)
      .post('/auth/local')
      .send({ email: users[0].email, password: users[0].password })
      .expect(200)
      .end(function(err, res) {
        if ( err ) throw err;
        request(app)
          .post('/api/groups')
          .set('Authorization', 'Bearer ' + res.body.token)
          .send({ name: "test", emails:['t@t.com','test2@test.com']})
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Object);
            res.body.name.should.be.equal('test');
            res.body.emails[0].should.be.equal('t@t.com');
            res.body.emails[1].should.be.equal('test2@test.com');
            res.body.users.length.should.be.equal(2);
            var user = User.findOne({_id:res.body.users[1]},function(err,user){
              should.exist(user);
              done();
            });
          });
      });
  });

  it('should respond with 401', function(done) {

    request(app)
      .post('/api/groups')
      .send({name:'test'})
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
