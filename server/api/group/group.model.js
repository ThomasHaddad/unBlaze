'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = require('../user/user.model');

var GroupSchema = new Schema({
  _creator: {type: Schema.ObjectId, ref:"User", index:true},
  name: String,
  info: {type:String, default:"new chat group"},
  active: {type:Boolean, default:true},
  users:[
    {type: Schema.ObjectId, ref:"User", index:true}
  ],
  emails:[]
});

GroupSchema
  .pre('save', function(next){
    var self = this;

    User.find().where('email').in(self.emails).exec(function(err, users){
      self.users = users;
      self.users.push(self._creator);
      next();
    })

  });

module.exports = mongoose.model('Group', GroupSchema);
