# umod
Micro data model for nodejs.


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