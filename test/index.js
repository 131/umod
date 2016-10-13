"use strict";

const uMod        = require('../');
const pg          = require('pg-co');
const expect      = require('expect.js');
const SQL         = require('sql-template');


const credentials = {
  host:'127.0.0.1',
  user:'postgres',
  database:'postgres',
};





describe("Basic testing", function() {

  this.timeout(20000);
  var lnk = new pg(credentials);

  it("Should get everything ready", function* (){
    yield lnk.connect();
  });


  it("should insert mock data", function*() {
    yield lnk.query(SQL`CREATE TEMP TABLE users (user_id INTEGER, user_name TEXT)`);

    yield lnk.insert("users", {user_id:41, user_name:'Adam'});
    yield lnk.insert("users", {user_id:42, user_name:'Eve'});


    var User = class extends uMod {
      static get sql_table(){ return "users"; }
      static get sql_key(){ return "user_id"; }
    };

    var all = yield User.from_where(lnk, true);
    expect(User.batch(all)).to.eql({
      'user_id': [41, 42]
    });


    var adam = yield User.instanciate(lnk, 41);
    expect(adam.user_name).to.eql("Adam");
    expect(adam.sql_where).to.eql({ 'user_id' : 41} );

    yield adam.sql_update(lnk, {user_name : "Cain" });

    expect(adam.user_name).to.eql("Cain");
    var dbcheck = yield lnk.value("users", {user_id : 41}, "user_name");
    expect(dbcheck).to.eql("Cain");


    yield adam.sql_delete(lnk);

    try {
      var bar = yield User.instanciate(lnk, 41);
      expect.fail("Not here");
    } catch(err){
      expect(err).to.eql("Cannot instanciate 41");
    }

  });






});