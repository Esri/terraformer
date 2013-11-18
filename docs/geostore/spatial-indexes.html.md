---
layout: documentation
---
# GeoStore Spatial Indexes

<!-- table_of_contents -->

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
var si = new SpatialIndex({
  "width": 45,
  "dateline": false
});
```

#### SpatialIndex.insert(geojson | envelope, id, callback)

Add a `geojson` object or `envelope` to a `SpatialIndex`.  It is important to include an `id`, as this is the key that is returned from searches.

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) _or_ [`Envelope`](/glossary/#envelope) | `object` | Must be either `GeoJSON` or `Envelope` |
| id | `String` _or_ `Number` | The `id` of the spatial area |
| callback | `function` | Callback to be fired when the `insert` has been completed |

_Example:_

```js
si.insert(geojson, id, function (err, res) {
  // Node.js style callback
});
```

#### SpatialIndex.remove(geojson | envelope, id, callback)

Remove a `geojson` or `envelope` object already in a SpatialIndex.

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) _or_ [`Envelope`](/glossary/#envelope) | `object` | Must be either `GeoJSON` or `Envelope` |
| id | `String` _or_ `Number` | The `id` of the spatial area |
| callback | `function` | Callback to be fired when the `remove` has been completed |

_Example:_

```js
si.remove(geojson, id, function (err, res) {
  // Node.js style callback
});
```

#### SpatialIndex.search(geojson | envelope, callback)

Searches for any `id`'s that can contain the `geojson` or `envelope` passed in.  These are returned as an `Array`.

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) _or_ [`Envelope`](/glossary/#envelope) | `object` | Must be either `GeoJSON` or `Envelope` |
| callback | `function` | Callback to be fired when the `search` has been completed |

_Example:_

```js
si.search(geojson, function (err, res) {
  // Node.js style callback
});
```

#### SpatialIndex.within(geojson | envelope, callback)

Searches for any `id`'s that are within the `geojson` or `envelope` passed in.  These are returned as an `Array`.

| Option | Value | Description |
| --- | --- | --- |
| [`GeoJSON`](/glossary/#geojson) _or_ [`Envelope`](/glossary/#envelope) | `object` | Must be either `GeoJSON` or `Envelope` |
| callback | `function` | Callback to be fired when the `search` has been completed |

_Example:_

```js
si.within(geojson, function (err, res) {
  // Node.js style callback
});
```
