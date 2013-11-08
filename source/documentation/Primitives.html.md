---
layout: default
---

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

#### Convex Hull

    // returns the convex hull of the polygon
    var ch = polygon.convexHull();

#### Envelope

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

## Point

A `Point` is a single point in space.

### Instantiation

    // create an empty Point
    var point = new Terraformer.Point();

    // create a Point from an Array of x (longitude) and y (latitude)
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

### Getting a Point

This will return a specicic point (by index) as a new instance of `Terraformer.Point`

    // Create a new Terraformer.Point object form the point at index
    var point = multi.get(1);

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

### Intersects
It is possible to check for the intersection of `LineString`, `MultiLineString`, `Polygon`, `Circle`, and `MultiPolygon` and `Feature`.  Any other type of intersection will result in `false` being returned.

    // check for intersection
    ls.intersects(new Terraformer.LineString([ [ 20, 10 ], [ 10, 20 ] ]));

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

### Getting a LineString

This will return a specicic line (by index) as a new instance of `Terraformer.LineString`

    // Create a new Terraformer.Point object form the point at index
    var line = mls.get(1);

### Intersects
It is possible to check for the intersection of `LineString`, `MultiLineString`, `Polygon`, `Circle`, and `MultiPolygon` and `Feature`.  Any other type of intersection will result in `false` being returned.

    // check for intersection
    mls.intersects(new Terraformer.LineString([ [ 20, 10 ], [ 10, 20 ] ]));

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

`contains` checks to see if a Primitive is contained within the Polygon  Currently, it will only operate on a `Point`, but does check to make sure that the `Point` is contained only in the Polygon area, and not within a hole.

    // create a point
    var point = new Terraformer.Point([ 10, 10 ]);

    // create a polygon
    var poly = new Terraformer.Polygon([ [ [ 0, 0 ], [ 0, 20 ], [ 20, 20 ], [  20, 0 ] ] ]);

    // check the results
    poly.contains(point); // should be true

### Intersects
It is possible to check for the intersection of `LineString`, `MultiLineString`, `Polygon`, `Circle`, and `MultiPolygon` and `Feature`.  Any other type of intersection will result in `false` being returned.

    // check for intersection
    poly.intersects(new Terraformer.LineString([ [ 20, 10 ], [ 10, 20 ] ]));

## MultiPolygon

### Instantiation

    // create an empty MultiPolygon
    var mp = new Terraformer.MultiPolygon();

    // create a MultiPolygon from an Array
    var mp = new Terraformer.MultiPolygon([
      [
        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
      ]
    ]);

    // create a MultiPolygon from GeoJSON
    var mp = new Terraformer.MultiPolygon({
        "type": "MultiPolygon",
        "coordinates": [
          [
            [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
            [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
          ]
        ]
    });

### Iterating

    // iterate through all polygons
    mp.forEach(function (polygon, index, coordinates) {
      // do something cool
    });

### Contains

`contains` checks to see if a Primitive is contained within the MultiPolygon  Currently, it will only operate on a `Point`, but does check to make sure that the `Point` is contained only in a Polygon area of the MultiPolygon, and not within a hole.

    // create a point
    var point = new Terraformer.Point([ 10, 10 ]);

    // create a multipolygon
    var mp = new Terraformer.MultiPolygon([ [ [ [ 0, 0 ], [ 0, 20 ], [ 20, 20 ], [  20, 0 ] ] ] ]);

    // check the results
    mp.contains(point); // should be true

### Intersects
It is possible to check for the intersection of `LineString`, `MultiLineString`, `Polygon`, `Circle`, and `MultiPolygon` and `Feature`.  Any other type of intersection will result in `false` being returned.

    // check for intersection
    mp.intersects(new Terraformer.LineString([ [ 20, 10 ], [ 10, 20 ] ]));

### Getting a LineString

This will return a specicic polygon (by index) as a new instance of `Terraformer.Polygon`

    // Create a new Terraformer.Point object form the point at index
    var polygon = mp.get(1);

## Feature

Features represent custom data (properties in the GeoJSON spec) and geographic data togather in a single object.


### Instantiation

You can instantiate a Feature by passing in a GeoJSON Feature or any GeoJSON geometry. But you must assign an `id` property for it to be valid GeoJSON.

    // creates a feature from a valid GeoJSON Object.
    var feature = new Terraformer.Feature({"type": "Point", "coordinates": [ 10, 10 ]);

### Contains

If your features geometry type is `Polygon` or `MultiPolygon` you can check to see if your Feature `contains a Point Geometry. Currently, it will only operate on a `Point`, but does check to make sure that the `Point` is contained only in the Polygon area, and not within a hole.

    // create a point
    var point = new Terraformer.Point([ 10, 10 ]);

    // create a polygon
    var feature = new Terraformer.Feature({type: "Polygon", coordinates: [ [ [ 0, 0 ], [ 0, 20 ], [ 20, 20 ], [  20, 0 ] ] ]});

    // check the results
    feature.contains(point); // should be true

### Intersects
It is possible to check for the intersection of `LineString`, `MultiLineString`, `Polygon`, `Circle`, and `MultiPolygon` and `Feature`.  Any other type of intersection will result in `false` being returned.

    // check for intersection
    feature.intersects(new Terraformer.LineString([ [ 20, 10 ], [ 10, 20 ] ]));

## FeatureCollection

A FeatureCollection is a wrapper around a set of features.

### Instantiation

You can create a FeatureCollection by passing in a GeoJSON FeatureCollection or an array of Features.

    var fc = new Terraformer.FeatureCollection([feature1, feature2]);

### Getting by ID

Because Features must have an `id` to be valid GeoJSON, you can search for a specific id with the `get` method.

    var fooFeature = fc.get("foo"); // will get the feature with the id of foo

## GeometryCollection

A GeometryCollection represents a set of geometries.

### Instantiation

You can create a GeometryCollection by passing in array of GeoJSON geometries or a GeoJSON GeometryCollection.

    var gc = new Terraformer.GeometryCollection([geom1, geom2]);

### Getting A Geometry

Like other multi geometry objects you can use the `get` method to get a the geometry at a specific index as an instance of `Terraformer.Primitive`.

    var myGeometry = gc.get(2);

## Circle

GeoJSON does not provide support for circles in the specification. However Terraformer provides circles as a type of Feature which has getters and setters for `center`, `steps`, and `radius`. The Feature contains a polygon which repesents the circe.

### Instantiation

You can create a Circle my passing in a GeoJSON position representing the center of a circle and the radius of the circle. By default radius will be set to 250 meters.

    // create a 1000 meter circle centered on the Esri R&D Center in Portland
    var circle = new Terraformer.Circle([-122.6764, 45.5165], 1000);

By default circle will be made of a 64 points. You can change this by passing in a third parameter.

    // this "circle" will only have 16 points
    var circle = new Terraformer.Circle([-122.6764, 45.5165], 100, 16);

### Moving The Circle

If you want to move the circle to a new location you can update the `center` property. Changing this property will recreate the circle polygon at the new location.

    // move the circle to Null Island
    circle.center = [0,0];

### Changing The Radius

Chaging the radius is similar to chaning the center of the circle. Simply set the `radius` property on the circle. Changing this property will recreate the circle polygon.

    // make the circle really big
    circle.radius = 2500

### Chagning Interpolation

As you change and alter your circle you may need to change the detail level. Changing the `steps` property will alter the level of detail in your circle.

    // make the circle more detailed
    circle.steps = 128;

### Contains

Since circles are polygons you can see if they contain points.

    // does this circle contain a point
    circle.contains(point); // true or false

### Intersects
It is possible to check for the intersection of `LineString`, `MultiLineString`, `Polygon`, `Circle`, and `MultiPolygon` and `Feature`.  Any other type of intersection will result in `false` being returned.

    // check for intersection
    circle.intersects(new Terraformer.LineString([ [ 20, 10 ], [ 10, 20 ] ]));
