---
layout: documentation
---
# Terraformer Core

## Primitives

The Terraformer Primitives are classes that map directly to their GeoJSON equivalents, adding convenience methods, geometric tools such as `within`, and `intersects` and spatial reference conversion methods.
`Terraformer.Primitive` is the base class for all primitives.  As such, it can perform most actions that every other primitive can.  All other primitives inherit from `Terraformer.Primitive`, and thus all methods on `Terraformer.Primitive` are available on those primitives.

When a `GeoJSON` object is passed in at instantiation, it will create an `object` of that type of `GeoJSON`.

### Instantiation

    // create an empty primitive
    var primitive = new Terraformer.Primitive();

    // create a typed primitive from GeoJSON
    // this will create an object of type Point
    var point = new Terraformer.Primitive({ "type": "Point", "coordinates": [ 100, 1 ] });

### Coordinate Systems

Terraformer has the ability to switch between Web Mercator and Geographic (WGS84) coordinate systems.  This is an in-place modification to the `object`.

    // to Web Mercator
    primitive.toMercator();

    // to WGS84
    primitive.toGeographic();

### Bounding Box

All primitives have the possibility of a bounding box.  A bounding box returns an array 4 points: `x1`, `x2`, `y1`, and `y2` denoting a `square` that encapsulates all points.

    // create a Polygon
    var poly = new Terraformer.Primitive({
      "type": "Polygon",
      "coordinates": [ [ [10, 10], [30, 20], [40, 30], [40, 40], [10, 10] ] ]
    });

    // should return [ 10, 10, 40, 40 ]
    var box = poly.bbox;

### Geographic Tools

All primitives have a set of geographic tools available.

### Convex Hull

    // returns the convex hull of the polygon
    var ch = polygon.convexHull();

### Envelope

This will return an envelope suitible for use with `Terraformer.RTree` of `x, y, width, height`.

    // returns the convex hull of the polygon
    var ev = polygon.envelope();

### Within

This will return true if the `primitive` is contained or equal to the `primitive` passed.

    var polygon1 = new Terraformer.Polygon([ [ [ 2, 2 ], [ 2, 3 ], [ 3, 3 ], [ 3, 2 ], [ 2, 2 ] ] ]);
    var polygon2 = new Terraformer.Polygon([ [ [ 1, 1 ], [ 1, 5 ], [ 5, 5 ], [ 5, 1 ], [ 1, 1 ] ] ]);

    // true
    polygon1.within(polygon2);

    // false
    polygon2.within(polygon1);

### Tools

Terraformer also exposes many generic tools for working with geographic data.

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