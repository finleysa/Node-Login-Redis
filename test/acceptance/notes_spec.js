'use strict';

process.env.DBNAME = 'album-test';
var app = require('../../app/app');
var request = require('supertest');
//var expect = require('chai').expect;
var User, userId, Note, u1, n1;
var cookie;

describe('notes', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Note = require('../../app/models/note');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({email:'prince@aol.com', password:'1234'});
      u1.hashPassword(function(){
        u1.insert(function(){
          userId = u1._id.toString();
          n1 = new Note({title:'Note', body:'paragraph', dateCreated:'', tags:'',  userId:userId});
          n1.insert(function(){
            done();
          });
        });
      });
    });
  });

  describe('GET /notes', function(){
    it('should not display the notes page if user is not logged in', function(done){
      request(app)
      .get('/notes')
      .expect(302, done);
    });
  });

  describe('AUTHORIZED', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .field('email', 'prince@aol.com')
      .field('password', '1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });

    describe('GET /notes', function(){
      it('should display the notes page if user is logged in', function(done){
        request(app)
        .get('/notes')
        .set('cookie', cookie)
        .expect(200, done);
      });
    });

    describe('GET /notes/new', function(){
      it('should display the new note form page', function(done){
        request(app)
        .get('/notes/new')
        .set('cookie', cookie)
        .expect(200, done);
      });
    });

    describe('POST /notes', function(){
      it('should create a new note', function(done){
        request(app)
        .post('/notes')
        .set('cookie', cookie)
        .field('title', 'Test Note Title')
        .field('body', 'Test Note Body')
        .field('dateCreated', '2014-02-25')
        .field('tags', 'tag1, tag2, tag3')
        .expect(302, done);
      });
    });

    describe('DELETE /notes/id', function(){
      it('should delete a specific note from the database', function(done){
        var id = n1._id.toString();
        request(app)
        .del('/notes/' + id)
        .set('cookie', cookie)
        .expect(302, done);
      });
    });

    describe('GET /notes/id', function(){
      it('should return a specific note from the database', function(done){
        var id = n1._id.toString();

        request(app)
        .get('/notes/' + id)
        .set('cookie', cookie)
        .expect(200, done);
      });
    });
  });

/////////
});
