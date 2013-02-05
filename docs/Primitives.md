# Terraformer Primitives

Terraformer includes a lightweight wrapper to `GeoJSON` allowing for a number of methods to be used on them.

## Primitive

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

All primitives have the posibility of a bounding box.  A bounding box returns an array 4 points: `x1`, `x2`, `y1`, and `y2` denoting a `square` that encapsulates all points.

    // create a Polygon
    var poly = new Terraformer.Primitive({
      "type": "Polygon",
      "coordinates": [ [ [10, 10], [30, 20], [40, 30], [40, 40], [10, 10] ] ]
    });
    
    // should return [ 10, 10, 40, 40 ]
    var box = poly.bbox;

### Geographic Tools

All primitives have a set of geographic tools available.

#### Convex Hull

    // returns the convex hull of the polygon
    var ch = polygon.convexHull();

## Point

A `Point` is a single point in space.

### Instantiation

    // create an empty Point
    var point = new Terraformer.Point();
    
    // create a Point from an Array
    var point = new Terraformer.Point( [ 10, 10 ] );
    
    // create a Point from GeoJSON
    var point = new Terraformer.Point({
      "type": "Point",
      "coordinates": [ 10, 10 ]
    });

## MultiPoint

A `MultiPoint` is a collection of multiple `Points`.

### Instantiation

    // create an empty MultiPoint
    var multi = new Terraformer.MultiPoint();
    
    // create a MultiPoint from an Array
    var multi = new Terraformer.MultiPoint( [ [ 10, 10 ], [ 20, 20 ] ] );
    
    // create a MultiPoint from GeoJSON
    var multi = new Terraformer.MultiPoint({
      "type": "MultiPoint",
      "coordinates": [ [ 10, 10 ], [ 20, 20 ] ]
    });

### Iterating

    // iterate through all points
    multi.forEach(function (point, index, coordinates) {
      // do something cool
    });

### Adding Point

    // add a point to the end of the coordinates
    multi.addPoint([ 10, 10 ]);

### Insert Point

    // insert a point before a specific index
    multi.insertPoint([ 10, 10 ], 1);

### Remove Point

    // remove a point at a specific index
    multi.removePoint(1);

## LineString

### Instantiation

    // create an empty LineString
    var ls = new Terraformer.LineString();
    
    // create a LineString from an Array
    var ls = new Terraformer.LineString([ [ 10, 10 ], [ 20, 20 ] ]);
    
    // create a LineString from GeoJSON
    var ls = new Terraformer.LineString({
      "type": "LineString",
      "coordinates": [ [ 10, 10 ], [ 20, 20 ] ]
    });

### Add Vertex

    // add a vertex at the end
    ls.addVertex([ 10, 10 ]);

### Insert Vertex

    // insert a vertex before a specified index
    ls.insertVertex([ 10, 10 ], 1);

### Remove Vertex

    // remove a vertex at a specified index
    ls.removeVertex(1);

## MultiLineString

### Instantiation

    // create an empty MultiLineString
    var mls = new Terraformer.MultiLineString();
    
    // create a MultiLineString from an Array
    var mls = new Terraformer.MultiLineString([ [ [ 100, 1 ], [ 200, 10 ] ], [ [ 30, 10 ], [ 10, 18 ] ] ]);
    
    // create a MultiLineString from GeoJSON
    var mls = new Terraformer.MultiLineString({
        "type": "MultiLineString",
        "coordinates": [
            [ [100.0, 0.0], [101.0, 1.0] ],
            [ [102.0, 2.0], [103.0, 3.0] ]
        ]
    });


### Iterating

    // iterate through all segments
    mls.forEach(function (segment, index, coordinates) {
      // do something cool
    });


## Polygon

### Instantiation

    // create an empty Polygon
    var poly = new Terraformer.Polygon();
    
    // create a Polygon from an Array (no holes)
    var poly = new Terraformer.Polygon([
        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
    ]);
    
    // create a Polygon from GeoJSON (with holes)
    var poly = new Terraformer.Polygon({
        "type": "Polygon",
        "coordinates": [
            [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
            [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
        ]
    });

### Add Vertex

    // add a vertex at the end
    poly.addVertex([ 10, 10 ]);

### Insert Vertex

    // insert a vertex before a specified index
    poly.insertVertex([ 10, 10 ], 1);

### Remove Vertex

    // remove a vertex at a specified index
    poly.removeVertex(1);

### Contains

`contains` checks to see if a Primitive is contained within the Primitive.  Currently, it will only operate on a `Point`, but does check to make sure that the `Point` is contained only in the Polygon area, and not within a hole.

    // create a point
    var point = new Terraformer.Point([ 10, 10 ]);
    
    // create a polygon
    var poly = new Terraformer.Polygon([ [ [ 0, 0 ], [ 0, 20 ], [ 20, 20 ], [  20, 0 ] ] ]);
    
    // check the results
    poly.contains(point); // should be true

## MultiPolygon

### Instantiation

## Feature

### Instantiation

## FeatureCollection

### Instantiation

## GeometryCollection

### Instantiation

## Circle

### Instantiation
