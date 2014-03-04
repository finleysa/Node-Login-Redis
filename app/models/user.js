/* jshint expr:true */
'use strict';

module.exports = User;
var _ = require('lodash');
var Mongo = require('mongodb');

var users = global.nss.db.collection('users');
//var Mongo = require('mongodb');
//var _ = require('lodash');
var bcrypt = require('bcrypt');

function User(user){
  this.email = user.email;
  this.password = user.password;
}

User.prototype.hashPassword = function(fn){
  var self = this;
  bcrypt.hash(this.password, 8, function(err, hash){
    self.password = hash;
    fn(self.password);
  });
};

User.prototype.insert = function(fn){
  var self = this;
  users.findOne({email:this.email}, function(err, user){
    if(!user){
      users.insert(self, function(err, records){
        fn(records[0]);
      });
    }else{
      fn(null);
    }
  });
};

User.findOne = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    fn(_.extend(record, User.prototype));
  });
};

User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, record){
    if(record){
      bcrypt.compare(password, record.password, function(err, result){
        result ? fn(record) : fn(null);
      });
    }else{
      fn(null);
    }
  });
};
