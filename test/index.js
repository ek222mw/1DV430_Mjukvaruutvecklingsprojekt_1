/*jshint esversion:6 */
var chai = require('chai');
var expect = require('chai').expect;
var User = require("../models/User");
var should = chai.should();
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
//var express = require('express');
//var server = express();
var request = require('request');
//var server = require("../server.js");
var reqHelper = require('../test/requestHelper')();

var user = require('../models/User');
var Genre = require('../models/Genre');
process.env.Test = "Test";
var server = require('../server');

/*var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);*/

/*before(function(done) {
    mockgoose.prepareStorage().then(function() {
        mongoose.connect('mongodb://localhost/genreDB', function(err) {
            done(err);
        });
    });
});*/




//Influence from: http://stackoverflow.com/questions/23895564/mocha-assertions-within-promise-not-working
describe('TF AF 1.1, 2,1 Registrera sig själva på webbsidan', function()
{


  var host = process.env['host_test'];
  var path = '/users/register';
  var url = host+path;





  after(function(done){
    user.findOneAndRemove({username:"test1"}).exec().then(function()
    {

      done();

    }).catch(function(error)
    {
      console.log(error);
      done(error);

    });
   });





   it("TF nr1, Lyckad registrering av användare", function(done)
    {


      var promise = new Promise(function(resolve,reject){
        
        var username = 'test1',
        password = 'password',
        email = "test@example.com";

        reqHelper.getPost(username,password,email,url).then(function(response)
        {

          resolve(response.statusCode);
        }).catch(function(err)
        {

          resolve(err.statusCode);
        });
      });
      promise.then(function(data){
        expect(data).to.equal(302);
        done();
      }).catch(function(error)
      {
        done(error);
      });


    });



   it("TF nr2, Försöka registera sig med tomma detaljer", function(done)
    {

      var promise = new Promise(function(resolve,reject){

        var username = '',
        password = '',
        email = '';
        reqHelper.getPost(username,password,email,url).then(function(response)
        {
          resolve(response.statusCode);
        }).catch(function(err)
        {
          resolve(err.statusCode);
        });
      });
      promise.then(function(data){
        expect(data).to.equal(400);
        done();
      }).catch(function(error)
      {
        done(error);
      });


    });

    it("TF nr3, Försöka registera sig med tomt lösenord", function(done)
     {

       var promise = new Promise(function(resolve,reject){

         var username = 'hej',
         password = '',
         email= '';
         reqHelper.getPost(username,password,email,url).then(function(response)
         {
           resolve(response.statusCode);
         }).catch(function(err)
         {
           resolve(err.statusCode);
         });
       });
       promise.then(function(data){
         expect(data).to.equal(400);
         done();
       }).catch(function(error)
       {
         done(error);
       });


     });


  it("TF nr4, Försöka registera sig med användarnamn som redan finns", function(done)
  {

  var promise = new Promise(function(resolve,reject){

    var username = 'username',
    password = 'password',
    email = 'test@example.com';
    reqHelper.getPost(username,password,email,url).then(function(response)
    {
      resolve(response.statusCode);
    }).catch(function(err)
    {
      resolve(err.statusCode);
    });
  });
  promise.then(function(data){
    expect(data).to.equal(500);
    done();
  }).catch(function(error)
  {
    done(error);
  });
});

it("TF nr5, Försöka registera sig med tom email", function(done)
{

var promise = new Promise(function(resolve,reject){

  var username = 'user',
  password = 'password',
  email = '';
  reqHelper.getPost(username,password,email,url).then(function(response)
  {
    resolve(response.statusCode);
  }).catch(function(err)
  {
    resolve(err.statusCode);
  });
});
promise.then(function(data){
  expect(data).to.equal(400);
  done();
}).catch(function(error)
{
  done(error);
});
});

it("TF nr6, Försöka registera sig med felaktig email", function(done)
{

var promise = new Promise(function(resolve,reject){

  var username = 'user',
  password = 'password',
  email = 'asasasdasd@asdasd';
  reqHelper.getPost(username,password,email,url).then(function(response)
  {
    resolve(response.statusCode);
  }).catch(function(err)
  {
    resolve(err.statusCode);
  });
});
promise.then(function(data){
  expect(data).to.equal(400);
  done();
}).catch(function(error)
{
  done(error);
});
});

it("TF nr7, Försöka registera sig med för långt användarnamn", function(done)
{

var promise = new Promise(function(resolve,reject){

  var username = 'uasasdasdasdasdasdasdsd11111111111222222222222asasdasdasdasdasd',
  password = 'pass',
  email = 'asasasdasd@asdasd.com';
  reqHelper.getPost(username,password,email,url).then(function(response)
  {
    resolve(response.statusCode);
  }).catch(function(err)
  {
    resolve(err.statusCode);
  });
});
promise.then(function(data){
  expect(data).to.equal(400);
  done();
}).catch(function(error)
{
  done(error);
});
});

});




describe('TF AF 1.3, 2.3 Create genre', function()
{
  var host = process.env['host_test'];
  var path = '/genres/create';
  var url = host+path;




   it("TF nr1, Lyckas skapa ny genre", function(done)
   {

      var promise = new Promise(function(resolve,reject){

        var genre = 'test1',
        username = 'test',
        test = process.env['secret_test'];
        reqHelper.postGenre(genre,username,test,url).then(function(response)
        {
          resolve(response.statusCode);
        }).catch(function(err)
        {
          resolve(err.statusCode);
        });
      });
      promise.then(function(data){
        expect(data).to.equal(302);
        done();
      }).catch(function(error)
      {
        done(error);
      });


    });

    it("TF nr2, Försöka skapa genre som redan finns", function(done)
    {

       var promise = new Promise(function(resolve,reject){

         var genre = 'Power metal',
         username = 'test',
         test = process.env['secret_test'];
         reqHelper.postGenre(genre,username,test,url).then(function(response)
         {
           resolve(response.statusCode);
         }).catch(function(err)
         {
           resolve(err.statusCode);
         });
       });
       promise.then(function(data){
         expect(data).to.equal(500);
         done();
       }).catch(function(error)
       {
         done(error);
       });


     });

     it("TF nr3, Försöka skapa tom genre", function(done)
     {

        var promise = new Promise(function(resolve,reject){

          var genre = '',
          username = 'test',
          test = process.env['secret_test'];
          reqHelper.postGenre(genre,username,test,url).then(function(response)
          {
            resolve(response.statusCode);
          }).catch(function(err)
          {
            resolve(err.statusCode);
          });
        });
        promise.then(function(data){
          expect(data).to.equal(400);
          done();
        }).catch(function(error)
        {
          done(error);
        });


      });

      it("TF nr4, Försöka skapa genre med namn längre än 50 tecken", function(done)
      {

         var promise = new Promise(function(resolve,reject){

           var genre = 'asdasdasdasssssssssssssssssssssssssssssssssssssssssssssssssss',
           username = 'test',
           test = process.env['secret_test'];
           reqHelper.postGenre(genre,username,test,url).then(function(response)
           {
             resolve(response.statusCode);
           }).catch(function(err)
           {
             resolve(err.statusCode);
           });
         });
         promise.then(function(data){
           expect(data).to.equal(400);
           done();
         }).catch(function(error)
         {
           done(error);
         });


       });
});
describe('TF AF 1.3, 2.3 Update genre', function()
{
       let host = process.env['host_test'];
       let path = '/genres/update/test1';
       let url = host+path;

       after(function(done){
         Genre.findOneAndRemove({genre:"test2"}).exec().then(function()
         {

           done();

         }).catch(function(error)
         {
           console.log(error);
           done(error);

         });
        });
        it("TF nr1, Försöka editera en genre till att vara tom", function(done)
        {
           var promise = new Promise(function(resolve,reject){

             var genre = '',
             username = 'test',
             test = process.env['secret_test'];
             reqHelper.postGenre(genre,username,test,url).then(function(response)
             {
               resolve(response.statusCode);
             }).catch(function(err)
             {
               resolve(err.statusCode);
             });
           });
           promise.then(function(data){
             expect(data).to.equal(400);
             done();
           }).catch(function(error)
           {
             done(error);
           });


         });
         it("TF nr2, Försöka editera en genre till att vara längre än 50 tecken", function(done)
         {
            var promise = new Promise(function(resolve,reject){

              var genre = 'sdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdsdasdas',
              username = 'test',
              test = process.env['secret_test'];
              reqHelper.postGenre(genre,username,test,url).then(function(response)
              {
                resolve(response.statusCode);
              }).catch(function(err)
              {
                resolve(err.statusCode);
              });
            });
            promise.then(function(data){
              expect(data).to.equal(400);
              done();
            }).catch(function(error)
            {
              done(error);
            });


          });


       it("TF nr3, Lyckas editera en genre", function(done)
       {
          var promise = new Promise(function(resolve,reject){

            var genre = 'test2',
            username = 'test',
            test = process.env['secret_test'];
            reqHelper.postGenre(genre,username,test,url).then(function(response)
            {
              resolve(response.statusCode);
            }).catch(function(err)
            {
              resolve(err.statusCode);
            });
          });
          promise.then(function(data){
            expect(data).to.equal(302);
            done();
          }).catch(function(error)
          {
            done(error);
          });


        });


});

describe('TF AF 1.3, 2.3 Delete genre', function()
{
       let host = process.env['host_test'];
       let path = '/genres/delete/test5';
       let url = host+path;

       before(function(done){
         let genre = new Genre({
           genre:'test5',
           username:'username'
         });
          genre.save().then(function()
         {
           done();
         }).catch(function(err)
         {
           done(err);
         });


      });
        it("TF nr1, Försöka radera en genre med fel användare", function(done)
        {
           var promise = new Promise(function(resolve,reject){

             var genre = 'test5',
             username = 'test',
             test = process.env['secret_test'];
             reqHelper.postGenre(genre,username,test,url).then(function(response)
             {
               resolve(response.statusCode);
             }).catch(function(err)
             {
               resolve(err.statusCode);
             });
           });
           promise.then(function(data){
             expect(data).to.equal(302);
             done();
           }).catch(function(error)
           {
             done(error);
           });


         });
         it("TF nr2, Lyckad radering av genre", function(done)
         {
            var promise = new Promise(function(resolve,reject){

              var genre = 'test5',
              username = 'username',
              test = process.env['secret_test'];
              reqHelper.postGenre(genre,username,test,url).then(function(response)
              {
                resolve(response.statusCode);
              }).catch(function(err)
              {
                resolve(err.statusCode);
              });
            });
            promise.then(function(data){
              expect(data).to.equal(302);
              done();
            }).catch(function(error)
            {
              done(error);
            });


          });





});
