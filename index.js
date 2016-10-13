"use strict";

var forIn     = require('mout/object/forIn');

class Base {

  constructor(infos) {
    forIn(infos, (v, k) => { this[k] = v; })
  }

  static *from_ids(lnk, guids){
    // "this" relate to the parent class, boo - yeah.

    var where = {}; where[this.sql_key] = guids;
    return yield this.from_where(lnk, where);
  }


  static *from_where(lnk, where){

    var tmp = yield lnk.select(this.sql_table, where), ret = {};

    tmp.forEach(v => {
      ret[v[this.sql_key]] = new this(v);//Hell awaits me
    });

    return Promise.resolve(ret);
  }

  static * instanciate(lnk, guid) {
    var tmp = (yield this.from_ids(lnk, [guid])) [guid];
    if(!tmp)
      throw ("Cannot instanciate " + guid);
    return Promise.resolve(tmp);
  }


  static batch(collection) {
    return {
      [this.sql_key] : Object.keys(collection)
    };
  }

  get where(){
    var sql_key  = this.constructor.sql_key;

    return {
      [sql_key] : this[sql_key]
    };
  }

  * sql_update(lnk, data) {
    yield lnk.update(this.constructor.sql_table, data, this.where);
    forIn(data, (v, k) => { this[k] = v; })
    return this;
  }

  * sql_delete(lnk) {
    yield lnk.delete(this.constructor.sql_table, this.where);
  }

}

module.exports = Base;
