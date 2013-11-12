---
title: Datastores
layout: documentation
---
# GeoStore Data Stores
<!-- table_of_contents -->
Data stores are the foundation of the GeoStore.  They are `key/value` storage devices that allow for creating entries, updating, deleting, and retrieving single `Feature` objects in GeoJSON.

Data Stores are designed to be asyncronous, using Node.js style callbacks.  In syncronough stores, like `Terraformer.Store.Memory` and `Terraformer.Store.LocalStorage` callbacks are executed immediately, but in truly asyncronous stores they behave as expected.

## Existing Data Stores

There are a couple of existing Data Stores that help you get started storing data immediately.

* [LocalStorage](https://github.com/Esri/terraformer-geostore-localstorage) - works in the browser only
* [Memory](https://github.com/Esri/terraformer-geostore-memory) - works in both the browser and Node.js
* [LevelDB](https://github.com/JerrySievert/terraformer-geostore-leveldb) - works in Node.js

## Writing a DataStore

Since Data Stores are simply `key/value` stores, it is very easy to write additional Data Stores as long as the method signatures are correct.

### Methods

#### new DataStore()

Instantiating a `DataStore` should return a new object containing method signatures conforming to the `DataStore` interface.

You can pass any needed arguments while instantiating.

_Example:_

```js
var ds = new DataStore({
  "path": "some_path",
  "username": "me",
  "password": "mypass"
});
```

#### DataStore.add(geostore, callback)

Add a `geojson` object to a DataStore.  In the case of a `Feature`, the `id` should be used as the primary key for storage and retrieval:

```js
// get the id
var id = geojson.id;

// store the data
this.magicdb.put(geojson.id, JSON.stringify(geojson));
```

If a `FeatureCollection` is passed in instead, each `Feature` inside of the `FeatureCollection` needs to be added before the `callback` is called.

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) | `object` | Must be either a `Feature` or `FeatureCollection` and contain an `id` |
| callback | `function` | Callback to be fired when the `add` has been completed |

_Example:_

```js
ds.add(geojson, function (err, res) {
  // Node.js style callback
});
```

#### DataStore.update(geostore, callback)

Update a `geojson` object already in a DataStore.  Only a `Feature` should be able to be updated, the `id` should be used as the primary key for update:

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) | `object` | Must be a `Feature` and contain an `id` |
| callback | `function` | Callback to be fired when the `update` has been completed |

_Example:_

```js
ds.update(geojson, function (err, res) {
  // Node.js style callback
});
```

#### DataStore.remove(id, callback)

Remove a `geojson` object from the DataStore by `id`.

| Option | Value | Description |
| --- | --- | --- |
| id | `String` _or_ `Number` | The `id` of the `Feature` to be removed |
| callback | `function` | Callback to be fired when the `remove` has been completed |

_Example:_

```js
ds.remove(id, function (err, res) {
  // Node.js style callback
});
```

#### DataStore.get(id, callback)

Retrieves a `geojson` object from the DataStore by `id`.

| Option | Value | Description |
| --- | --- | --- |
| id | `String` _or_ `Number` | The `id` of the `Feature` to be retrieved |
| callback | `function` | Callback to be fired when the `remove` has been completed |

_Example:_

```js
ds.get(id, function (err, res) {
  // Node.js style callback
});
```
