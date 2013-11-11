---
layout: documentation
---

# GeoStore Spatial Indexes

Spatial Indexes are an extremely important part of the GeoStore.  Spatial Indexes allow for very quick elimination of `Features` and are part of the core of the GeoStore.

Spatial Indexes are asyncronous and use Node.js style callbacks.

## Existing Spatial Indexes

Terraformer currently ships with a single spatial index, with more coming soon.

* [RTree](https://github.com/esri/terraformer-geostore-rtree) - RTree Index, works in Node.js and the browser

## Writing a Spatial Index

Spatial Indexes are designed for searching spatial data, whether in 2D or 3D.  The Terraformer GeoStore platform has defined a set of indexes that allow for multiple spatial index types to be used.  As long as the methods are asyncronous and conform to the Terraformer GeoStore interface, any type of spatial index can be used.

### Methods

#### new SpatialIndex()

Instantiating a `SpatialIndex` should return a new object containing method signatures conforming to the `SpatialIndex` interface.

You can pass any needed arguments while instantiating.

_Example:_

```js
var ds = new SpatialIndex({
  "width": 45,
  "dateline": false
});
```

#### SpatialIndex.insert(geojson | envelope, id, callback)

Add a `geojson` object or `envelope` to a DataStore.  In the case of a `Feature`, the `id` should be used as the primary key for storage and retrieval:

If a `FeatureCollection` is passed in instead, each `Feature` inside of the `FeatureCollection` needs to be added before the `callback` is called.

| Option | Value | Description |
| --- | --- | --- |
| geojson | `object` | Must be either a `Feature` or `FeatureCollection` and contain an `id` |
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
| geojson | `object` | Must be a `Feature` and contain an `id` |
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