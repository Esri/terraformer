---
layout: documentation
---

# Indexes

Indexes are important to be able to access geo data quickly.  Terraformer provides an R-Tree index based on `RTree.js`.

An R-Tree index works on an `envelope`, including the upper left corner `x` and `y` coordinates, and the `width` and `height` of the polygon's `envelope`.

It is important to note that the index will return `envelopes` that match, and does not do point in polygon checks.  It is up to the developer to determine whether the results returned are correct.

## Using

### Browser

    <script src="rtree.min.js" type="text/javascript"></script>
    <script type="text/javascript">
      var index = new Terraformer.RTree.RTree();

### Node.js

    var rtree = require('terraformer-rtree');

    var index = new rtree.RTree();

## Instance Methods

### Insert

Inserting adds an entry to the index for searching later.  An `envelope` and `data` are provided during the insertion.

    // an envelope for a polygon ranging from [ 100, 10 ] to [ 120, 20 ]
    var envelope = {
      x: 100,
      y: 10,
      w: 20,
      h: 10
    };

    var data = { rowId: 23 };

    index.insert(envelope, data);

### Search

Searching an index will return any matching `envelope` in `envelope` as an `array` of data that was inserted with the `envelope`.

    // search for a point
    var envelope = {
      x: 101,
      y: 11,
      h: 0,
      w: 0
    };

    // should call the callback with results of [ { rowId: 23 } ]
    index.search(envelope, function (err, results) {
      // results [ { rowId: 23 } ]
    });

