---
title: Alternate Indexes
layout: documentation
---

# GeoStore Alternate Indexes

Alternate Indexes are a very powerful way to apply additional filters to your searches on `properties` of a `Feature`.

## Using Alternate Indexes

Alternate Indexes can be added to an existing GeoStore very easily:

```js
// create an index on the properties.street value
gs.addIndex({
  property: "street",
  index: new BTree()
});

// create an index on the properties.crime value
gs.addIndex({
  property: "crime",
  index: new BTree()
});
```

Queries against Alternate Indexes are very specific to the index, but the basic syntax of a query is straightforward:

```js
gs.within(
  geojson,
  {
    "name": {
      "equals": "Main"
    },
    "crime": {
      "equals": "Arson"
    }
  },
  function (err, res) {
    // node.js style callback
  }
);
```

In this example, first every `Feature` that is within the GeoJSON is found in the Spatial Index, then each of those entries are searched for in the B-Tree indexes.  Only those entries that have a `properties.street` of "Main" and a `properties.crime` of "Arson" are returned.

### Indexable Data

Only data that is available in `properties` is indexable.  When a `Feature` is added to the GeoStore, the list of Alternate Indexes is scanned, and any property that is found is added to that Alternate Index.

Alternate Indexes are asyncronous and use Node.js style callbacks.

### Existing Alternate Indexes

Terraformer currently ships with a single alternate index, with more coming soon.

* [B-Tree](https://github.com/JerrySievert/terraformer-geostore-index-btree) - A B-Tree index 

## Writing an Alternate Index

Alternate Indexes rely on two methods to be exposed to the GeoStore to add and remove data.  Additional methods can be added for querying and are introspected for searching.

For instance, when a `equals` query is made against an Alternate Index, if the `equals` method is on the index, then it is called with all arguments from the `contains` or `within`.

### Index.add(value, id, callback)

Add a value to the Alternate Index by `id`.

| Option | Value | Description |
| --- | --- | --- |
| value | `String` _or_ `Number` | The value to add to the index |
| id | `String` _or_ `Number` | The `id` of the `Feature` to be added |
| callback | `function` | Callback to be fired when the `add` has been completed |

_Example:_

```js
idx.add(value, id, function (err, res) {
  // Node.js style callback
});
```

### Index.remove(value, id, callback)

Add a value to the Alternate Index by `id`.

| Option | Value | Description |
| --- | --- | --- |
| value | `String` _or_ `Number` | The value to remove from the index |
| id | `String` _or_ `Number` | The `id` of the `Feature` to be removed |
| callback | `function` | Callback to be fired when the `remove` has been completed |

_Example:_

```js
idx.add(value, id, function (err, res) {
  // Node.js style callback
});
```
