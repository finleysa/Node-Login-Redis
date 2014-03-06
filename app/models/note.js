/* jshint expr:true */
/*global dateString:false */
'use strict';

module.exports = Note;
var notes = global.nss.db.collection('notes');
var Mongo = require('mongodb');
var _ = require('lodash');

function Note(note){
  this.title = note.title;
  this.body = note.body;
  this.dateCreated = note.dateCreated ? new Date(note.dateCreated).toDateString() : new Date(dateString);
  this.tags = note.tags.split(', ').map(function(n){return n.trim();});
  // _.compact creates an array with all falsey values removed
  this.tags = _.compact(this.tags);
  this.userId = '';
}

Note.prototype.insert = function(fn){
  notes.insert(this, function(err, record){
    fn(record[0]);
  });
};

Note.findByUserId = function(userId, fn){
  userId = Mongo.ObjectID(userId);
  notes.find({userId:userId}).toArray(function(err, records){
    fn(records);
  });
};

Note.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  notes.remove({_id:_id}, function(err, deleted){
    fn(deleted);
  });
};

Note.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  notes.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};
