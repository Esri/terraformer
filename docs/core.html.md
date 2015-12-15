---
title: Terraformer Core
layout: documentation
---
# Terraformer Core

<!-- table_of_contents -->

## Terraformer.Primitive
Terraformer Primitives are JavaScript objects that map directly to their GeoJSON couterparts. Converting a GeoJSON object into a Terraformer Primitive will allow you use convenience methods like `point.within(polygon)`.

Every `Terraformer.Primitive` inherits from the `Terraformer.Primitive` base class, thus all other Primitives share the `Terraformer.Primitive` methods.

There is a Primitive for every type of GeoJSON object, plus a `Circle` Primitive which represents a circle as a polygon.

### Constructor
You create new `Terraformer.Primitive` objects by passing it a valid [GeoJSON Object](/glossary/#geojson). This will return a `Terraformer.Primitive` of the type that corresponds with type of your GeoJSON object.

```js
var point = new Terraformer.Primitive({
  type:"Point",
  coordinates:[1,2]
});

point instanceof Terraformer.Point; //-> true
point instanceof Terraformer.Primitive; //-> true

point.within(polygon) //-> true or false
```

### Methods

Method | Returns | Description
--- | --- | --- | ---
`toMercator()` | `this` | Converts this GeoJSON object's coordinates to the [web mercator spatial reference](http://spatialreference.org/ref/sr-org/6928/).
`toGeographic()` | `this` | Converts this GeoJSON object's coordinates to [geographic coordinates](http://spatialreference.org/ref/epsg/4326/).
`envelope()` | [`Envelope`](/glossary/#envelope) | Returns an object with `x`, `y`, `w` and `h` suitable for passing to most indexes.
`bbox()` | [`BBox`](/glossary/#bbox) | Returns the [GeoJSON Bounding Box](/glossary/#bbox) for this primitive.
`convexHull()` | [`Polygon`](#polygon) or `null` | Returns the convex hull of this primitive as a [`Polygon`](#polygon). Will return `null` if the convex hull cannot be calculated or a valid Polygon cannot be created.
<code>contains(<a href="/glossary/#geometry">&lt;Geometry&gt;</a> <i>geometry</i>)</code> | `Boolean` | Returns `true` if the passed [`GeoJSON Geometry`](/glossary/#geometry) object is completely contained inside this primitive.
<code>within(<a href="/glossary/#geometry">&lt;Geometry&gt;</a> <i>geometry</i>)</code> | `Boolean` | Returns `true` if the passed [`GeoJSON Geometry`](/glossary/#geometry) object is completely within this primitive.
<code>intersects(<a href="/glossary/#geometry">&lt;Geometry&gt;</a> <i>geometry</i>)</code> | `Boolean` | Returns `true` if the passed [`GeoJSON Geometry`](/glossary/#geometry) intersects this primitive.

## Terraformer.Point
A JavaScript object representing a [GeoJSON Point](/glossary/#point).

### Constructor
`Terraformer.Point` can be created by passing a [GeoJSON Coordinate Pair](/glossary/#coordinate) like `[longitude, latitude]`, with plain `x,y`, or a valid [GeoJSON Point](/glossary/#point).

```js
var point1 = new Terraformer.Point({
  type:"Point",
  coordinates:[1,2]
});

var point2 = new Terraformer.Point(1,2);

var point3 = new Terraformer.Point([1,2]);
```

## Terraformer.MultiPoint
A JavaScript object representing a [GeoJSON MultiPoint](/glossary/#multipoint).

### Constructor

`Terraformer.MultiPoint` can be created by passing in a valid [GeoJSON MultiPoint](/glossary/#multipoint), or an array of [GeoJSON Coordinates](/glossary/#coordinates) like `[longitude, latitude]`.

```js
var multipoint1 = new Terraformer.MultiPoint({
  type:"MultiPoint",
  coordinates:[ [1,2],[2,1] ]
});

var multipoint2 = new Terraformer.MultiPoint([ [1,2],[2,1] ]);
```

### Methods
Method | Returns | Description
--- | --- | --- |
`forEach(<Function> function)`| `null` | Iterates over each point. Equivalent to `multipoint.coordinates.forEach(function)`. The function will be called with `point`, `index` and `coordinates`.
`get(<Integer> index)` | [`Point`](/glossary/#point-primitive) | Returns a [`Terraformer.Point`](/glossary/#point-primitive) for the point at `index` in the coordinate array.
<code>addPoint(<a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>)</code> | `this` | Adds a new coordinate to the end of the coordinate array. Equivalent to `multipoint.coordinates.push([3,4])`.
<code>insertPoint(<a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>, <Integer> index)</code> | `this` | Inserts the passed point at the passed index. Equivalent to `multipoint.coordinates.splice(index, 0, point)`
<code>removePoint(&lt;Integer&gt; index <em>or</em> <a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>)</code> | `this` | Removes the point at `index` or the passed Coordinate depending on the type of object passed in.

## Terraformer.LineString
A JavaScript object representing a [GeoJSON LineString](/glossary/#linestring).

### Constructor

`Terraformer.LineString` can be created by passing in a valid [GeoJSON LineString](/glossary/#linestring), or an array of [GeoJSON Coordinates](/glossary/#coordinates) like `[longitude, latitude]`.

```js
var linestring = new Terraformer.LineString({
  type:"LineString",
  coordinates:[ [1,2],[2,1] ]
});

var linestring = new Terraformer.LineString([ [1,2],[2,1] ]);
```

### Methods
Method | Returns | Description
--- | --- | ---
<code>addVertex(<a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>)</code> | `this` | Adds a new coordinate to the end of the coordinate array. Equivalent to `linestring.coordinates.push([3,4])`.
<code>insertVertex(<a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>, &lt;Integer&gt; index)</code> | `this` | Inserts the passed coordinate at the passed index. Equivalent to `linestring.coordinates.splice(index, 0, point)`
<code>removeVertex(&lt;Integer&gt; index)</code> | `this` | Removes the coordinate at `index`. Equivalent to calling `linestring.coordinates.splice(remove, 1)`

## Terraformer.MultiLineString
A JavaScript object representing a [GeoJSON MultiLineString](/glossary/#multilinestring).

### Constructor
`Terraformer.LineString` can be created by passing in a valid [GeoJSON MultiLineString](/glossary/#multilinestring), or an array  that is valid coordinate array for [GeoJSON MultiLineString](/glossary/#multilinestring).

```js
var multilinestring = new Terraformer.MultiLineString({
  type:"LineString",
  coordinates:[ [1,2],[2,1] ]
});

var multilinestring = new Terraformer.MultiLineString([ [[1,1],[2,2],[3,4]], [[0,1],[0,2],[0,3]] ]);
```

### Methods
Method | Returns | Description
--- | --- | ---
`forEach(<Function> function)`| `null` | Iterates over each LineString. Equivalent to `multilinestring.coordinates.forEach(function)`. The function will be called with `linestring`, `index` and `coordinates`.
`get(<Integer> index)` | [`LineString`](#linestring) | Returns a [`Terraformer.LineString`](#linestring) for the LineString at `index` in the coordinates array.

## Terraformer.Polygon
A JavaScript object representing a [GeoJSON Polygon](/glossary/#polygon).

### Constructor
`Terraformer.Polygon` can be created by passing in a valid [GeoJSON Polygon](/glossary/#polygon), or an array that is a valid coordinate for a [GeoJSON Polygon](/glossary/#polygon).

```js
var polygon1 = new Terraformer.Polygon({
  "type": "Polygon",
  "coordinates": [
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
    ]
 });

var polygon2 = new Terraformer.Polygon([
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
]);
```

### Methods
Method | Returns | Description
--- | --- | --- |
<code>addVertex(<a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>)</code> | `this` | Adds a new coordinate just before the closing coordinate of the linear ring.
<code>insertVertex(<a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>, <Integer> index)</code> | `this` | Inserts the passed coordinate at the passed index. Equivalent to `polygon.coordinates.splice(index, 0, point)`
`removeVertex(<Integer> index)` | `this` | Removes the coordinate at `index`. Equivalent to calling `polygon.coordinates.splice(remove, 1)`
`close()` | `this` | Ensures that the first and last vertex of the polygon are equal to each other.
`hasHoles()` | Boolean | True if this polygon has holes.
`holes()` | Array `<Polygon>` | Returns an `Array` of `Polygon` objects made from each hole in this polygon.

## Terraformer.MultiPolygon
A JavaScript object representing a [GeoJSON MultiPolygon](/glossary/#multipolygon).

### Constructor
`Terraformer.MultiPolygon` can be created by passing in a valid [GeoJSON MultiPolygon](/glossary/#multipolygon), or an array that is a valid coordinate array for [GeoJSON MultiPolygon](/glossary/#multipolygon).

```js
var multipolygon1 = new Terraformer.MultiPolygon({
  "type": "MultiPolygon",
  "coordinates": [
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
    ]
 });

var multipolygon2 = new Terraformer.MultiPolygon([
  [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
  [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
]);
```

### Methods
Method | Returns | Description
--- | --- | --- |
`forEach(<Function> function)`| `null` | Iterates over each LineString. Equivalent to `multipolygon.coordinates.forEach(function)`. The function will be called with `polygon`, `index` and `coordinates`.
`get(<Integer> index)` | [`Polygon`](/glossary/#polygon-primitive) | Returns a [`Terraformer.Polygon`](/glossary/#polygon-primitive) for the Polygon at `index` in the coordinate array.

## Terraformer.Feature
A JavaScript object representing a [GeoJSON Feature](/glossary/#feature).

### Constructor
`Terraformer.Feature` can be created by passing in a valid [GeoJSON Feature](/glossary/#feature) or [GeoJSON Geometry](/glossary/#geometry).

```js
var feature1 = new Terraformer.Feature({
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
      [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
    ]
  }
});

var feature2 = new Terraformer.Feature({
  "type": "Polygon",
  "coordinates": [
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
  ]
});
```

## Terraformer.FeatureCollection
A JavaScript object representing a [GeoJSON FeatureCollection](/glossary/#featurecollection).

### Constructor
`Terraformer.FeatureCollection` can be created by passing a valid [GeoJSON Feature Collection](/glossary/#featurecollection) or an array of [GeoJSON Features](/glossary/#feature).

```js
var featurecollection1 = new Terraformer.FeatureCollection(
  "type": "FeatureCollection",
  "features": [feature1, feature2]
});

var featurecollection2 = new Terraformer.FeatureCollection([feature1, feature2]);
```

### Methods
Method | Returns | Description
--- | --- | ---
`forEach(<Function> function)`| `null` | Iterates over each Feature. Equivalent to `featurecollection.features.forEach(function)`. The function will be called with `feature`, `index` and `coordinates`.
`get(<Integer> index)` | [`Feature`](/glossary/#feature) | Returns a [`Terraformer.Feature`](/glossary/#feature) for the Feature at `index` in the features array.

## Terraformer.GeometryCollection
A JavaScript object representing a [GeoJSON Geometry Collection](/glossary/#geometrycollection).

### Constructor
`Terraformer.GeometryCollection` can be created by passing a valid [GeoJSON Geometry Collection](/glossary/#geometrycollection) or an array of [GeoJSON Geometries](/glossary/#geometry).

```js
var geometrycollection1 = new Terraformer.GeometryCollection(
  "type": "FeatureCollection",
  "features": [geometry1, geometry2]
});

var geometrycollection2 = new Terraformer.GeometryCollection([geometry1, geometry2]);
```

### Methods

Method | Returns | Description
--- | --- | ---
`forEach(<Function> function)`| `null` | Iterates over each LineString. Equivalent to `geometrycollection.coordinates.forEach(function)`. The function will be called with `geometry`, `index` and `coordinates`.
`get(<Integer> index)` | [`Primitive`](/glossary/#feature-primitive) | Returns a [`Terraformer.Primitive`](/glossary/#feature-primitive) for the Geometry at `index` in the coordinate array.

## Terraformer.Circle
The GeoJSON spec does not provide a way to visualize circles. `Terraformer.Circle` is actual a [GeoJSON Feature]() object that contains a Polygon representing a circle with a certain number of sides.

### Constructor
`Terraformer.Circle` is created with a `center`, `radius`, and `steps`.

Option | Type | Default | Description
--- | --- | --- | --- |
`center` | [`Coordinate`](/glossary/#coordinate) | `null` | **Required** A [GeoJSON Coordinate](/glossary/#coordinate) in `[x,y]` format.
`radius` | `Integer` | `250` | The radius of the circle in meters.
`steps` | `Integer` | `32` | How many steps will be used to create the polygon that represents the circle.

```js
circle = new Terraformer.Circle([45.65, -122.27], 500, 64);

circle.contains(point);
```

### Methods
Method | Returns | Description
--- | --- | ---
`recalculate()` | this | Recalculates the circle
<code>steps(&lt;Integer <em>optional</em>&gt; steps)</code> | `Integer` | Returns the number of steps to produce the polygon representing the circle. If the `steps` parameter is passed the circle will be recalculated witht he new step count before returning.
<code>radius(&lt;Integer <em>optional</em>&gt; radius)</code> | `Integer` | Returns the radius circle. If the `radius` parameter is passed the circle will be recalculated witht he new radius before returning.
<code>center(<a href="/glossary/#coordinate">&lt;Coordinate <em>optional</em>&gt;</a> <i>center</i>)</code> | [`Coordinates`]() | Returns the center of the circle. If the `center` parameter is passed the circle will be recalculated with the new center before returning.

## Terraformer.Tools
Terraformer also has numerous helper methods for working with GeoJSON and geographic data. These tools work with a mix of lower level GeoJSON constructs like [`Coordinates`](/glossary/#coordinate), [Coordinate Arrays](/glossary/#coordinates) and [GeoJSON](/glossary/#geojson) objects and [Terraformer Primitives](/glossary/#primitive)

### Spatial Reference Conversions
Method | Returns | Description
--- | --- | ---
<code>toMercator(<a href="/glossary/#geojson">&lt;GeoJSON&gt;</a> <i>geojson</i>)</code> | [`GeoJSON`](/glossary/#geojson) | Converts this GeoJSON object's coordinates to the [web mercator spatial reference](http://spatialreference.org/ref/sr-org/6928/). This is an in-place modification of the passed object.
<code>toGeographic(<a href="/glossary/#geojson">&lt;GeoJSON&gt;</a> <i>geojson</i>)</code> | [`GeoJSON`](/glossary/#geojson) | Converts this GeoJSON object's coordinates to [geographic coordinates](http://spatialreference.org/ref/epsg/4326/). This is an in-place modification of the passed object.
<code>applyConverter(<a href="/glossary/#geojson">&lt;GeoJSON&gt;</a> <i>geojson</i>), function) | [`GeoJSON`](/glossary/#geojson) | Runs the passed `function`against every [`Coordinate`]() in the `geojson` object. Your `function` will be passed a [`Coordinate`](/glossary/#coordinate) and will be expected to return a [`Coordinate`]().
<code>positionToMercator(<a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>) | [`Coordinate`](/glossary/#coordinate) | Converts the passed [`Coordinate`](/glossary/#coordinate) to [web mercator spatial reference](http://spatialreference.org/ref/sr-org/6928/).
<code>positionToGeographic(<a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>) | [`Coordinate`](/glossary/#coordinate) | Converts the passed [`Coordinate`](/glossary/#coordinate) to [geographic coordinates](http://spatialreference.org/ref/epsg/4326/).

### Calculations
Method | Returns | Description
--- | --- | ---
<code>calculateBounds(<a href="/glossary/#geojson">&lt;GeoJSON&gt;</a> <i>geojson</i>)</code> | [`BBox`](/glossary#bbox) | Returns a [`GeoJSON bounding box`](/glossary#bbox) for the passed geoJSON.
<code>calculateEnvelope(<a href="/glossary/#geojson">&lt;GeoJSON&gt;</a> <i>geojson</i>)</code> | [`Envelope`](/glossary#envelope) | Returns an object with `x`, `y`, `w`, `h`. Suitable for passing to most indexes.
<code>convexHull(<a href="/glossary/#geojson">&lt;GeoJSON&gt;</a> <i>geojson</i>)</code> | [`Coordinates`](/glossary#geojson-coordinates) | Returns an array of [`coordinates`](/glossary#geojson-coordinates) representing the [convex hull](http://en.wikipedia.org/wiki/Convex_hull) the the passed geoJSON.

### Comparisons
Method | Returns | Description
--- | --- | ---
<code>coordinatesContainPoint(<a href="/glossary/#coordinates">&lt;Coordinates&gt;</a> <i>coordinates</i>, <a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>)</code> | `Boolean` |  Accepts a [`coordinate`](/glossary#geojson-coordinates) array and a [`coordinate`](/glossary#geojson-coordinate) and returns `true` if the point falls within the coordinate array.
<code>polygonContainsPoint(<a href="/glossary/#polygon">&lt;Polygon&gt;</a> <i>polygon</i>, <a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>)</code> | `Boolean` | Accepts a [polygon](/glossary#geojson-polygon) and a [`coordinate`](/glossary#geojson-coordinate) and returns `true` if the point falls within the polygon.
<code>arrayIntersectsArray(<a href="/glossary/#coordinates">&lt;Coordinates&gt;</a> <i>coordinates</i>, <a href="/glossary/#coordinates">&lt;Coordinates&gt;</a> <i>coordinates</i>)</code> | `Boolean` | Accepts two arrays of [`coordinates`](/glossary#geojson-coordinates) and returns `true` if they cross each other at any point.
<code>coordinatesEqual(<a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>, <a href="/glossary/#coordinate">&lt;Coordinate&gt;</a> <i>coordinate</i>)</code> | `Boolean` | Accepts two [`coordinates`](/glossary#geojson-coordinate) and returns `true` if the passed coordinates are equal to each other.
