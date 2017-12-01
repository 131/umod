"use strict";

const uMod        = require('../');
const Pg          = require('pg-aa');
const expect      = require('expect.js');
const SQL         = require('sql-template');


const credentials = {
  host:'127.0.0.1',
  user:'postgres',
  database:'postgres',
};





describe("Basic testing", function() {

  this.timeout(20000);
  var lnk = new Pg(credentials);

  it("Should get everything ready", async function (){
    await lnk.connect();
  });


  it("should insert mock data", async function() {
    await lnk.query(SQL`CREATE TEMP TABLE users (user_id TEXT, user_name TEXT)`);

    await lnk.insert("users", {user_id:'a41', user_name:'Adam'});
    await lnk.insert("users", {user_id:'a42', user_name:'Eve'});


    var User = class extends uMod {
      static get sql_table(){ return "users"; }
      static get sql_key(){ return "user_id"; }
    };


    var all = await User.from_ids(lnk, ['a42','a41']);
    expect(Object.keys(all)).to.eql(['a42','a41']);


    var all = await User.from_where(lnk, true);
    expect(User.batch(all)).to.eql({
      'user_id': ['a41', 'a42']
    });


    var adam = await User.instanciate(lnk, 'a41');
    expect(adam.user_name).to.eql("Adam");
    expect(adam.batch()).to.eql({ 'user_id' : 'a41'} );

    await adam.sql_update(lnk, {user_name : "Cain" });

    expect(adam.user_name).to.eql("Cain");
    var dbcheck = await lnk.value("users", {user_id : 'a41'}, "user_name");
    expect(dbcheck).to.eql("Cain");


    await adam.sql_delete(lnk);

    try {
      var bar = await User.instanciate(lnk, 'a41');
      expect.fail("Not here");
    } catch(err){
      expect(err).to.eql("Cannot instanciate a41");
    }

  });






});