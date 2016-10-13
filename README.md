# umod
Micro data model mapper for nodejs.

[![Build Status](https://travis-ci.org/131/umod.svg?branch=master)](https://travis-ci.org/131/umod)
[![Coverage Status](https://coveralls.io/repos/github/131/umod/badge.svg?branch=master)](https://coveralls.io/github/131/umod?branch=master)
[![NPM version](https://img.shields.io/npm/v/umod.svg)](https://www.npmjs.com/package/umod)


# Example
```
const uMod = require('umod');

class File extends uMod {
  //dostuff
  static get sql_table() { return "someable"; }
  static get sql_key() { return "some_key"; }
}

var lnk = pg.connect("somecreds@somehost");

co(function*(){
  var foo = yield File.instanciate(lnk, some_guid);
    //results in SELECT * FROM sometable WHERE some_key=?, some_guid
    //return a simple File instance with all columns as properties


  var foos = yield File.from_ids(lnk, [some_guid, some_other_guid]);
    //same thing here
});

```

# API
## Static instanciate 
Search for a model through data connector, throw if missing

## Static from_ids
Instanciate a list of model, return a key indexed dictionnary



# TODO
* Get rich or die tryin'

# Shoutbox, keywords, SEO love
model, data model, micro model, co, sql, yks, static inheritance, pg, pg-co, model collection, "Let's have a beer & talk in Paris"


# Credits
* [131](https://github.com/131)

