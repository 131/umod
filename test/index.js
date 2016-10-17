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
    yield lnk.query(SQL`CREATE TEMP TABLE users (user_id TEXT, user_name TEXT)`);

    yield lnk.insert("users", {user_id:'a41', user_name:'Adam'});
    yield lnk.insert("users", {user_id:'a42', user_name:'Eve'});


    var User = class extends uMod {
      static get sql_table(){ return "users"; }
      static get sql_key(){ return "user_id"; }
    };


    var all = yield User.from_ids(lnk, ['a42','a41']);
    expect(Object.keys(all)).to.eql(['a42','a41']);


    var all = yield User.from_where(lnk, true);
    expect(User.batch(all)).to.eql({
      'user_id': ['a41', 'a42']
    });


    var adam = yield User.instanciate(lnk, 'a41');
    expect(adam.user_name).to.eql("Adam");
    expect(adam.batch()).to.eql({ 'user_id' : 'a41'} );

    yield adam.sql_update(lnk, {user_name : "Cain" });

    expect(adam.user_name).to.eql("Cain");
    var dbcheck = yield lnk.value("users", {user_id : 'a41'}, "user_name");
    expect(dbcheck).to.eql("Cain");


    yield adam.sql_delete(lnk);

    try {
      var bar = yield User.instanciate(lnk, 'a41');
      expect.fail("Not here");
    } catch(err){
      expect(err).to.eql("Cannot instanciate a41");
    }

  });






});