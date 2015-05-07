'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var userFixture = require('../user/user.fixtures');
var User = require('../user/user.model');
var Group = require('../group/group.model');
var async = require('async');
var io = require('socket.io-client');

var options = {
  transports: ['websocket'],
  'force new connection': true,
  path: '/socket.io-client'
};



var users, token, group, user;


function login(done, userIndex) {
  users = userFixture.getUsers();
  userIndex = userIndex || 0;
  user = users[userIndex];
  request(app)
    .post('/auth/local')
    .send({email: users[0].email, password: users[0].password})
    .expect(200)
    .end(function (err, res) {
      if (err) done(err);
      token = res.body.token;
      done();
    })
}

before(function (done) {
  userFixture.createUsers(done);
});
before(function (done) {
  login(done);
});


describe('GET /api/groups', function () {


  it('should respond with JSON array', function (done) {
    request(app)
      .get('/api/groups')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('should respond with 401', function (done) {

    request(app)
      .get('/api/groups')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});


describe('POST /api/groups', function () {

  it('should respond with JSON object', function (done) {

    request(app)
      .post('/api/groups')
      .set('Authorization', 'Bearer ' + token)
      .send({name: "test", emails: ['t@t.com', 'test2@test.com']})
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        res.body.name.should.be.equal('test');
        res.body.emails[0].should.be.equal('t@t.com');
        res.body.users.length.should.be.equal(2);
        async.parallel([
            function (callback) {
              var user = User.findOne({_id: res.body.users[1]}, function (err, user) {
                if (err) return done(err);
                should.exist(user, 'user found in database');
                should.not.exist(err, 'user not found in database');
                callback(null, user);
              });
            },
            function (callback) {
              var creator = User.findOne({_id: res.body.users[0]}, function (err, user) {
                if (err) return done(err);
                should.exist(user, 'creator found in database');
                should.not.exist(err, 'creator not found in database');
                callback(null, user);
              });
            }],
          function (err, result) {
            var users = result; // contient {user, user}
            group = res.body;
            done(err);

          }
        );
      });

  });

  it('should remove duplicate subscriber emails', function (done) {

    request(app)
      .post('/api/groups')
      .set('Authorization', 'Bearer ' + token)
      .send({name: "test", emails: ['toto@toto.com', 'toto@toto.com', 'test2@test.com', 'test2@test.com']})
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.emails.length.should.be.equal(1, 'wrong email number');
        res.body.users.length.should.be.equal(2, 'wrong user number');
        done();
      });

  });


  it('should respond with 401', function (done) {

    request(app)
      .post('/api/groups')
      .send({name: 'test'})
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });


});
describe('DELETE /api/groups/group', function () {
  it('should delete user from the group', function (done) {

    request(app)
      .delete('/api/groups/' + group._id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
      .end(function (err, res) {
        if (err) return done(err);
        Group.findOne({_id: group._id}, function (err, group2) {
          if (err) return done(err, 'groupe non trouvé');
          var index = group2.users.indexOf(users[0]._id);
          index.should.be.equal(-1, 'user still in group');
        });
        done();
      });


  });

  it('should delete group when there is no user left in it', function (done) {
    done();
  });


  describe('POST /api/groups/nnn/emails', function () {
    it('should respond with 401 if not creator of the group', function (done) {
      var data = {
        _creator: users[1]._id,
        name: 'test',
        emails: [users[0].email]
      };
      Group.create(data, function (err, group) {
        if (err) done(err);
        request(app)
          .post('/api/groups/' + group._id + '/emails')
          .send({emails: ['tt@t.com']})
          .set('Authorization', 'Bearer ' + token)
          .expect(403)
          .end(function (err, res) {
            if (err) return done(err);
            done();
          })
      });
    });
    it('should respond with error if no emails', function (done) {
      var data = {
        _creator: user._id,
        name: 'test',
        emails: ['bla@bla.com']
      };
      Group.create(data, function (err, group) {
        if (err) done(err);
        request(app)
          .post('/api/groups/' + group._id + '/emails')
          .set('Authorization', 'Bearer ' + token)
          .expect(422)
          .end(function (err, res) {
            if (err) return done(err);
            done();
          })
      });
    });

    it('should respond with no error', function (done) {
      var data = {
        _creator: user._id,
        name: 'test',
        emails: ['bla@bla.com',users[1].email, 'toto@toto.com']
      };
      Group.create(data, function (err, group) {
        if (err) done(err);
        request(app)
          .post('/api/groups/' + group._id + '/emails')
          .set('Authorization', 'Bearer ' + token)
          .send({emails:['t@t.com','t@ttt.com','t@tt.com']})
          .expect(204)
          .end(function (err, res) {
            if (err) return done(err);
            Group.findOne({_id: group._id}, function (err, group) {
              console.log(group);
              console.log(users);
              group.emails.length.should.be.equal(5,'wrong emails number');
              group.users.length.should.be.equal(2,'wrong users number');
            });
            done();
          })
      });
    });
    it('should send new group by socketio to group subscriber users', function (done) {
      // connect to user2 and wait for data
      // crate group for user2
      // user 2 shouls receive group

      var data = {
        _creator: user._id,
        name: 'test',
        emails: ['bla@bla.com', users[1].email, 'toto@toto.com']
      };


      var checkMessage = function(client, tag){

        client.on(tag, function(msg){

          data._creator.should.equal(msg._creator);
          data.name.should.equal(msg.name);
          client.disconnect();

        })

      };

      var client1, client2;
      var socketURL = 'http://localhost:9000';
      var socketURL1 = 'group_'+users[0]._id+':save';

      client1 = io.connect(socketURL, options);

      client1.on('connect_error', function(err){
        console.log('error '+err);
      });

      client1.on('connect', function(a, b){

        console.log('connected');
        checkMessage(client1, socketURL1);
        Group.create(data, function (err, group) {
          if(err) done(err);
          console.log('group created');
        });

      });




    });
  });
});
