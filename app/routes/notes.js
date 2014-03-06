'use strict';

var Note = require('../models/note');
var mongo = require('mongodb');

exports.index = function(req, res){
  Note.findByUserId(req.session.userId, function(notes){
    res.render('notes/index', {title:'All Notes', notes:notes});
  });
};

exports.new = function(req, res){
  res.render('notes/new', {title:'New Note'});
};

exports.create = function(req, res){
  var note = new Note(req.body);
  note.userId = mongo.ObjectID(req.session.userId);
  note.insert(function(){
    res.redirect('/notes');
  });
};

exports.destroy = function(req, res){
  Note.deleteById(req.params.id, function(){
    res.redirect('notes/index');
  });
};

exports.show = function(req, res){
  Note.findById(req.params.id, function(note){
    res.render('notes/show', {note:note});
  });
};
