/* jshint expr:true */
'use strict';

process.env.DBNAME = 'note2';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var User, userId;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      var u1 = new User({email:'prince@aol.com', password:'1234'});
      u1.hashPassword(function(){
        u1.insert(function(insertedUser){
          userId = insertedUser._id.toString();
          done();
        });
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      var u1 = new User({email:'bob@aol.com', password:'1234'});
      expect(u1).to.be.instanceof(User);
      expect(u1.email).to.equal('bob@aol.com');
      expect(u1.password).to.equal('1234');
    });
  });
  
  describe('#hashPassword', function(){
    it('should hash password with salt', function(done){
      var u1 = new User({email:'bob@aol.com', password:'1234'});
      u1.hashPassword(function(){
        expect(u1.password).to.not.equal('1234');
        done();
      });
    });
  });
  
  describe('#insert', function(){
    it('should insert user into database', function(done){
      var u1 = new User({email:'bob@aol.com', password:'1234'});
      u1.hashPassword(function(){
        u1.insert(function(insertedUser){
          expect(insertedUser.email).to.equal('bob@aol.com');
          expect(insertedUser._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });

    it('should not insert a duplicate email into database', function(done){
      var u2 = new User({email:'prince@aol.com', password:'1234'});
      u2.hashPassword(function(){
        u2.insert(function(insertedUser){
          expect(insertedUser).to.equal(null);
          done();
        });
      });
    });
  });
  
  describe('.findById', function(){
    it('should user by id in database', function(done){
      User.findOne(userId, function(foundUser){
        expect(foundUser._id.toString()).to.deep.equal(userId);
        done();
      });
    });
  });
  
  describe('.findByEmailAndPassword', function(){
    it('should find user by email and password', function(done){
      User.findByEmailAndPassword('prince@aol.com', '1234', function(foundUser){
        expect(foundUser._id.toString()).to.deep.equal(userId);
        done();
      });
    });

    it('should return false if email is incorrect', function(done){
      User.findByEmailAndPassword('bad@aol.com', '1234', function(badUser){
        expect(badUser).to.equal(null);
        done();
      });
    });
    
    it('should return false if password is incorrect', function(done){
      User.findByEmailAndPassword('prince@aol.com', 'wrong', function(badPassword){
        expect(badPassword).to.equal(null);
        done();
      });
    });
  });

////////////////////
});
