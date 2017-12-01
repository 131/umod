"use strict";

const forIn     = require('mout/object/forIn');
const pick      = require('mout/object/pick');

class Base {

  constructor(infos) {
    forIn(infos, (v, k) => { this[k] = v; });
  }

  static async from_ids(ctx, guids) {
    // "this" relate to the parent class, boo - yeah.

    var where = {}; where[this.sql_key] = guids;
    var response = await this.from_where(ctx, where);
    response = pick(response, guids);
    return response;
  }


  static async from_where(ctx, where) {

    var tmp = await ctx.lnk.select(this.sql_table, where);
    var ret = {};

    tmp.forEach(v => {
      ret[v[this.sql_key]] = new this(v);//Hell awaits me
    });

    return Promise.resolve(ret);
  }

  static async instanciate(ctx, guid) {
    var tmp = (await this.from_ids(ctx, [guid])) [guid];
    if(!tmp)
      throw ("Cannot instanciate " + guid);
    return Promise.resolve(tmp);
  }


  static batch(collection) {
    return {
      [this.sql_key] : Object.keys(collection)
    };
  }

  batch() {
    var sql_key  = this.constructor.sql_key;

    return {
      [sql_key] : this[sql_key]
    };
  }

  async sql_update(ctx, data) {
    await ctx.lnk.update(this.constructor.sql_table, data, this.batch());
    forIn(data, (v, k) => { this[k] = v; });
    return this;
  }

  async sql_delete(ctx) {
    await ctx.lnk.delete(this.constructor.sql_table, this.batch());
  }

}

module.exports = Base;
