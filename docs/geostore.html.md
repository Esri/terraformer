---
title: GeoStore
layout: documentation
---

# GeoStore

<!-- table_of_contents -->

The Terraformer GeoStore is a set of building blocks for managing spatial data as a GeoJSON `Feature` or `FeatureCollection`.  It includes functionality for storing and querying data in primarily a spatial manner.

GeoStores are broken into three parts: [Data Stores](/geostore/data-stores), [Spatial Indexes](/geostore/spatial-indexes), and [Alternate Indexes](/geostore/alternate-indexes).

More in-depth information can be found in [Core Concepts](/geostore/core-concepts).

## Using the GeoStore

The GeoStore can be used in both the browser and server-side via Node.js.  Functionally, they behave the same, but some Data Stores and Indexes will only work in one environment.  For instance, LocalStorage will not work by default in Node.js.

The GeoStore uses Node.js style callbacks, so most method signatures require a `callback` function that expects `error` and `response`: `function (err, res) { }`.

The GeoStore manages data that is made available as either a `Feature` or a `FeatureCollection`.  In order to work, there must be an `id` field.

```js
{
  "type": "Feature",
  "properties": {},
  "id": "my id",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          -111.09374, 41.50857
        ],
        [
          -111.09374, 45.08903
        ],
        [
          -105.11718, 45.08903
        ],
        [
          -105.11718, 41.50857
        ],
        [
          -111.09374, 41.50857
        ]
      ]
    ]
  }
}
```

### Using in the Browser

Using the GeoStore in the browser requires including both Terraformer and the GeoStore:

```html
<script src="terraformer.min.js"></script>
<script src="terraformer-geostore.min.js"></script>
```

Once those are included, you can create a new `Store`.  You will need to include both a Data Store and a Spatial Index to instantiate a GeoStore.

```js
// create a new GeoStore using Memory and an RTree Index
var store = new Terraformer.GeoStore({
  store: new Terraformer.Store.Memory(),
  index: new Terraformer.RTree()
});
```

Once the store has been created, you can start using it right away.

### Using in Node.js

In Node.js, the components are available via `require()`.

```js
// require geostore, an RTree index, and a LevelDB data store
var GeoStore = require('terraformer-geostore').GeoStore;
var RTree = require('terraformer-geostore-rtree').RTree;
var LevelStore = require('terraformer-geostore-leveldb').LevelStore;
```

Once the packages are in scope, it is very similar as using the GeoStore in the browser.

```js
var store = new GeoStore({
  store: new LevelStore(),
  index: new RTree()
});
```

### Methods

#### GeoStore.add(geojson, callback)

Add a `geojson` object to the GeoStore.

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) | `object` | Must be either a `Feature` or `FeatureCollection` and contain an `id` |
| callback | `function` | Callback to be fired when the `add` has been completed |

_Example:_

```js
store.add(geojson, function (err, res) {
  // Node.js style callback
});
```

#### GeoStore.update(geojson, callback)

Update a single `geojson` `Feature` in the GeoStore.

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) | `object` | Must be a `Feature` and contain an `id` |
| callback | `function` | Callback to be fired when the `update` has been completed |

_Example:_

```js
store.update(geojson, function (err, res) {
  // Node.js style callback
});
```

#### GeoStore.remove(id, callback)

Removes a single `geojson` `Feature` by `id`.

| Option | Value | Description |
| --- | --- | --- |
| id | `String` _or_ `Number` | The `id` of the `Feature` to be removed |
| callback | `function` | Callback to be fired when the `remove` has been completed |

_Example:_

```js
store.remove(id, function (err, res) {
  // Node.js style callback
});
```

#### GeoStore.get(id, callback)

Retrieves a single `geojson` `Feature` by `id`.

| Option | Value | Description |
| --- | --- | --- |
| id | `String` _or_ `Number` | The `id` of the `Feature` to be retrieved |
| callback | `function` | Callback to be fired when the `get` has been completed |

_Example:_

```js
store.get(id, function (err, res) {
  // Node.js style callback
});
```

#### GeoStore.contains(geojson, search, callback)

Find all `Features` that contain the `geojson primitive` passed in.  `contains` can use additional indexes to do set elimination on properties of a `Feature`.

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) | `object` | A GeoJSON primitive to search with |
| search (optional) | `object` | The second argument is optional.  If provided it contains additional search criteria for set elimination |
| callback | `function` | Callback to be fired when the `contains` has been completed |

_Example:_

```js
store.contains(geojson, function (err, res) {
  // Node.js style callback
});

store.contains(
  geojson,
  {
    "name":
    {
      "equals": "Multnomah"
    }
  },
  function (err, res) {
    // Node.js style callback
  }
);
```

#### GeoStore.within(geojson, search, callback)

Find all `Features` that are within the `geojson primitive` passed in.  `within` can use additional indexes to do set elimination on properties of a `Feature`.

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) | `object` | A GeoJSON primitive to search with |
| search (optional) | `object` | The second argument is optional.  If provided it contains additional search criteria for set elimination |
| callback | `function` | Callback to be fired when the `within` has been completed |

_Example:_

```js
store.within(geojson, function (err, res) {
  // Node.js style callback
});

store.within(
  geojson,
  {
    "name":
    {
      "equals": "Multnomah"
    }
  },
  function (err, res) {
    // Node.js style callback
  }
);
```

#### GeoStore.createReadStream()

GeoStore supports readable streams in both the browser and Nodejs.  Currently only `flowing` streams are supported.  Streams can be created with the `createReadStream()` method.  When a stream has been created, the next `within` or `contains` request uses that stream in place of a callback.  It is important to note that the stream only lasts for the duration of a *single* search via `within` or `contains`.

The stream will emit `data` on any data, and `end` with the final entry found.

Since streams are not reentrant in the GeoStore, it is recommended to create a new GeoStore for each stream. Streams are destroyed after the `end` event has been called.

_Example:_

```js
var stream = store.createReadStream();

stream.on("data", function (geojson) {
  // found geojson
});

stream.on("end", function (geojson) {
  // final geojson object
});
```
