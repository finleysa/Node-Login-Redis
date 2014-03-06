'use strict';

process.env.DBNAME = 'album-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var User;

describe('users', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      var u1 = new User({email:'prince@aol.com', password:'1234'});
      u1.hashPassword(function(){
        u1.insert(function(){
          done();
        });
      });
    });
  });

  describe('GET /', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('GET /auth', function(){
    it('should display the login page', function(done){
      request(app)
      .get('/auth')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register / Login');
        done();
      });
    });
  });

  describe('POST /register', function(){
    it('should register the user', function(done){
      request(app)
      .post('/register')
      .field('email', 'bob@aol.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
    
    it('should not register the user', function(done){
      request(app)
      .post('/register')
      .field('email', 'prince@aol.com')
      .field('password', 'wrong')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register / Login');
        done();
      });
    });
  });
  
  describe('POST /login', function(){
    it('should login a user', function(done){
      request(app)
      .post('/login')
      .field('email', 'prince@aol.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers['set-cookie']).to.have.length(1);
        done();
      });
    });
    
    it('should not login a user due to a bad login', function(done){
      request(app)
      .post('/login')
      .field('email', 'bob@aol.com')
      .field('password', 'wrong')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register / Login');
        done();
      });
    });
  });
///////////
});
