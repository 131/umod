# umod
Micro data model for nodejs.
Rely on (async/await) data connector (process.env.lnk) availability


# Example
```
class File extends require('umod') {
  //dostuff

}
File.table = "someable";
File.key = "some_key";

co(function*(){
  var foo = yield File.instanciate(some_guid);
    //results in SELECT * FROM sometable WHERE some_key=?, some_guid
    //return a simple File instance with all columns as properties

  var foos = yield File.from_ids([some_guid, some_other_guid]);
    //same thing here
});

```

# API
## Static instanciate 
Search for a model through data connector, throw if missing

## Static from_ids
Instanciate a list of model, return a key indexed dictionnary


# Notes
I recommand using static getters to declare the (mandatory) "table" & "key" property (it's easier to read)


# TODO
* Get rich or die tryin'

# Shoutbox, keywords, SEO love
model, data model, micro model, co, sql, yks, static inheritance, pg, pg-co, model collection, "Let's have a beer & talk in Paris"


# Credits
* [131](https://github.com/131)