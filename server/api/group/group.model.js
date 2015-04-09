'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = require('../user/user.model');
var GroupSchema = new Schema({
  _creator: {type: Schema.ObjectId, ref: "User"},
  name: String,
  info: {type: String, default: "chat group"},
  active: {type: Boolean, default: true},
  users: [{type: Schema.ObjectId, ref: "User"}],
  invitations: [
    {type: String}
  ]
});
GroupSchema
  .virtual('emails')
  .set(function (emails) {
    var self = this;
    var mail;
    
    for (var i = 0; i < emails.length; i++) {
      mail = emails[i];
      User.findOne({email: emails[i]}, function (err, user) {
        if (err) {
          console.log(err);
        } else {
          if (user) {

            self.users.push(mongoose.Types.ObjectId(user._id));
          } else {
            self.invitations.push(mail);
          }
        }
        self.save();
      });
    }
  });
module.exports = mongoose.model('Group', GroupSchema);
