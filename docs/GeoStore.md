# GeoStore

`Terraformer.GeoStore` is a class built for handing lightweight storage and querying of large amounts of [GeoJSON Features](http://www.geojson.org/geojson-spec.html#feature-objects). It is very fast and index the [rough US counties data](https://github.com/Esri/Terraformer/blob/master/examples/geostore/counties_rough.json) (about 950k) in about 120ms and search for which county contains a point in about 6.5ms. These numbers are form the latest version of Chrome.

## Introduction

`Terraformer.GeoStore` is instantiated with an instance of a `Terraformer.Store` and an index right now the only index available is `Terraformer.RTree`

``` js
var store = new Terraformer.GeoStore({
  store: new Terraformer.Store.Memory(),
  index: new Terraformer.RTree()
});
```

This will create an instance of GeoStore that lives in memory. You can easily write your own stores by adhering to a simple spec. But for now this will do.

### About Stores

Stores are designed to be syncronous or asyncronous. All methods on `GeoStore` return an instance of `Terraformer.Deferred` a [Promises A](http://wiki.commonjs.org/wiki/Promises/A) compatible object. You can also pass in a Node JS style callback like `function(error, response)`.

In syncronous stores like `Terraformer.Store.Memory` and `Terraformer.Store.LocalStorage` callbacks are executed immediatly. But in asyncronous stores they might behave like normal async callbacks.

### About Indexes

Indexes make querying data fast. When you query a GeoStore for something like `store.contains(geojson)` you are asking a store all shapes that contain the supplied geojson object. The index will do a rough guess based on the style of index (RTree) and return an approximation of what objects contain(geojson).

Once the index has returned its results each result is retrived from the store and `result.contains(geojson)` is called for each object this gives us a much more accurate result.

### Adding Data

Adding data to stores is simple. You can pass a Node JS style callback or use the returned deferred to add an optional callback.

``` js
store.add(geojson, function(err, resp){
  // optional callback. Node style
}).then(function(){
  // Promises style success callback
}, function(){
  // Promises style error callback
});
```

Only GeoJSON `Feature` and `FeatureCollection` objects are accepted. All `Feature` objects that are added must have an `id` property, according ot the [GeoJSON spec](http://www.geojson.org/geojson-spec.html#feature-objects). Features and automatically indexed by the index and persisted via the store.

### Updating Data

If you need to update a record in a store just pass a GeoJSON `Feature` with the same `id` property.

``` js
store.update(geojson, function(err, resp){
  // optional callback. Node style
}).then(function(results){
  // Promises style success callback
}, function(error){
  // Promises style error callback
});
```

### Querying Data

There are several method to query data on a `GeoStore`. You can ask for ojects that `contains`, `intersects` or are completly `within` another GeoJSON geometry. each of these options cooresponds to a method on the store.

#### Contains

``` js
store.contains(geojson, function(err, resp){
  // optional callback. Node style
}).then(function(){
  // Promises style success callback
}, function(){
  // Promises style error callback
});
```

You can pass a Node style callback or use the returned deferred to handle the results. **You must use the callback/deferred to handle results even for syncronous stores**.

*Currently only `contains(point)` is supported in the future you will be able to pass any GeoJSON geometry.*

*`contains` will be depricated in a future version and replaced by `intersects` for shapes where any part touches and `within` for shapes that are completely contained within other shapes.*

#### By ID

If you know a features `id` you can also retrive that feature from the store.

``` js
store.get(id, function(err, resp){
  // optional callback. Node style
}).then(function(){
  // Promises style success callback
}, function(){
  // Promises style error callback
});
```

### Removing Data

To remove a feature just pass its id  to the `remove` method

``` js
store.remove(id, function(err, resp){
  // optional callback. Node style
}).then(function(){
  // Promises style success callback
}, function(){
  // Promises style error callback
});
```

### Serializing Stores

`Terraformer.Store.Memory` and `Terraformer.Store.LocalStorage` both support `serialize` and `deserialize` methods. These are great if you want to dump the data to JSON and persist it somewhere.

``` js
store.store.serialize(function(err, serializedStore){
  // optional callback. Node style
}).then(function(serializedStore){
  // Promises style success callback
}, function(error){
  // Promises style error callback
});
```

### Serializing Indexes

`Terraformer.RTree` supports `serialize` and `deserialize` both methods take callbacks.

``` js
store.index.serialize(function(err, serializedStore){
  // optional callback. Node style
}).then(function(serializedStore){
  // Promises style success callback
}, function(error){
  // Promises style error callback
});
```

### Serialization Example

Create a new store and add some data to it

``` js
var store = new Terraformer.GeoStore({
  store: new Terraformer.Store.Memory(),
  index: new Terraformer.RTree()
});

// adding some data...
```

Great now you can serialize the store and the index. each callback will recive

``` js
store.store.serialize(function(error, data){
  // persist the data respresenting the store somewhere
});

store.index.serialize(function(error, data){
  // persist the data respresenting the index somewhere
});
```

When you need to load the store to the same state again just deserialize the data.

``` js
// do something to get the serialized store and index

var store = new Terraformer.GeoStore({
  store: new Terraformer.Store.Memory().deserialize(serializedStore, callback),
  index: new Terraformer.RTree().deserialize(serializedIndex, callback)
});

// do stuff...
```

You can listen for the callbacks to fire to know when deserializing is complete. Because `Terraformer.Store.Memory`, `Terraformer.Store.LocalStorage` and `Terraformer.RTree` are all syncronous all callback will execute syncronously.

## Custom Stores

If you want to create a custom way to persist data (perhaps asyncronously to a database or API) you can create your own store. You can use this as a template most of this is comments so dont be intimidated.

``` js
// function to act a a constructor
var MyCustomStore = function MyCustomStore(){}

// impliment an add method, this will get passed a geojson obejct that you should store
// and a deferred that you should resolve when you are done persisting the geojson
MyCustomStore.prototype.add = function(geojson, deferred){

  // ... do whatever you need to do to persist the data ...

  // resolve the deferred when you are done persisting data
  deferred.resolve(geojson);

  // you can also reject the deferred if there is an error
  deferred.reject(yourError);

  // return the deferred so it can accept callbacks
  return deferred;
};

// remove the data from the index and data with id returns true if removed successfully.
MyCustomStore.prototype.remove = function(id, deferred){

  // ... do whatever you need to do to delete the data ...

  // resolve the deferred when you are done deleting data
  deferred.resolve(true);

  // you can also reject the deferred if there is an error
  deferred.reject(yourError);

  // return the deferred so it can accept callbacks
  return deferred;
};

// return the data stored at id
MyCustomStore.prototype.get = function(id, deferred){

  // ... do whatever you need to do to get the data ...

  // resolve the deferred when you are done getting data
  deferred.resolve(geojson);

  // you can also reject the deferred if there is an error
  deferred.reject(yourError);

  // return the deferred so it can accept callbacks
  return deferred;
};

MyCustomStore.prototype.update = function(geojson, deferred){

  // ... do whatever you need to do to update the data ...

  // resolve the deferred when you are done updating data
  deferred.resolve(geojson);

  // you can also reject the deferred if there is an error
  deferred.reject(yourError);

  // return the deferred so it can accept callbacks
  return deferred;
};

MyCustomStore.prototype.serialize = function(deferred){

  // ... do whatever you need to do to serialize your data ...

  // resolve the deferred when you are done serializing data
  deferred.resolve(this);

  // you can also reject the deferred if there is an error
  deferred.reject(yourError);

  // return the deferred so it can accept callbacks
  return deferred;
};


MyCustomStore.prototype.deserialize = function(serializedStore, deferred){
  // ... do whatever you need to do to deserialize your data ...

  // resolve the deferred when you are done deserializing data
  deferred.resolve(this);

  // you can also reject the deferred if there is an error
  deferred.reject(yourError);

  // return the deferred so it can accept callbacks
  return deferred;
};
```

Functions recive a GeoJSON Feature to store and a deferred object to resolve or reject when you are done storing it. If you want to be able to serialize and deserialze your data you can also impliment those methods.

When you are done you can create a new instace of your store to GeoStore.

``` js
var store = new Terraformer.GeoStore({
  store: new MyCustomStore(),
  index: new Terraformer.RTree()
});
```

## Custom Indexes

It is possible to create custom indexes. Documentation will be coming soon.
