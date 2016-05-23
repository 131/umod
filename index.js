"use strict";

var ctx   = process.env;

var forIn     = require('mout/object/forIn');

class Base {
  constructor(infos) {
    forIn(infos, (v, k) => { this[k] = v; })
  }

  static *from_ids(guids){
    // "this" relate to the parent class, boo - yeah.

    var where = {}; where[this.key] = guids;
    var tmp = yield ctx.lnk.select(this.table, where), ret = {};

    tmp.forEach(v => {
      ret[v[this.key]] = new this(v);//Hell awaits me
    });

    return Promise.resolve(ret);
  }

  static * instanciate(guid) {
    var tmp = (yield this.from_ids([guid])) [guid];
    if(!tmp)
      throw ("Cannot instanciate " + guid);
    return Promise.resolve(tmp);
  }

  get where(){
    var key  = this.constructor.key, out = {};
    out[key] = this[key];
    return out;
  }

  * update(data) {
    yield ctx.lnk.update(this.constructor.table, data, this.where);
    forIn(data, (v, k) => { this[k] = v; })
    return this;
  }

}

module.exports = Base;
