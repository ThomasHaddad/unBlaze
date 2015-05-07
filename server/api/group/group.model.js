'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var User = require('../user/user.model');
var _ = require('lodash');
var GroupSchema = new Schema({
  _creator: {type: Schema.ObjectId, ref: "User", index: true},
  name: {type: String, required: true},
  info: {type: String, default: "new chat group"},
  active: {type: Boolean, default: true},
  users: [
    {type: Schema.ObjectId, ref: "User", index: true}
  ],
  emails: []
});

GroupSchema
  .pre('save', function (next) {
    this.emails = _.uniq(this.emails); // cas où un mail non inscrit a été rentré plusieurs fois
    console.log('first presave' + this.emails);
    var self = this;
    User.find().where('email').in(self.emails).where('_id').nin(this.users).exec(function (err, users) {
      self.users= _.union(self.users,users);
      if(self.isNew){
        self.users = users;
        var index = self.users.indexOf(self._creator);
        if (index === -1) self.users.push(self._creator); // on ajoute le créateur
        }
        User.find().where('_id').in(self.users).select('email').exec(function(err,users){
          self.emails = _.difference(self.emails, _.pluck(users,'email')); // on supprime tous les utilisateurs qui sont inscrits des mails
          console.log('end presave'+self.emails);
          next();
        });
    });
  });

GroupSchema.methods = {
  removeUser: function (user,callback) {
    var index = this.users.indexOf(user._id);
    if (index > -1) this.users.splice(index, 1);
    if (this.emails.length || this.users.length){
      this.save(function (err) {
        return callback(err);
      });
    }else{
      this.remove(function(err){
        return callback(err);
      })
    }
  },
  addEmails: function(emails,callback){
    if(!emails) throw(new Error('no emails given'));
    this.emails = _.union(this.emails,emails);
    this.save(function(err,group){
      if(err) throw(err);
      return callback(err,group);
    })
  }
};
module.exports = mongoose.model('Group', GroupSchema);
