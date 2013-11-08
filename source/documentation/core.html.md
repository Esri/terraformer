---
layout: documentation
---

# Terraformer Core

### Primitive
Terraformer Primitives are Javascript objects that map directly to their GeoJSON couterparts. Converting a GeoJSON object into a Terraformer Primitive will allow you use convenience methods like `point.within(polygon)`.

Every `Terraformer.Primitive` inherits from the `Terraformer.Primitive` base class, thus all other Primitives share the `Terraformer.Primitive` methods.

There is a Primitive for every type of GeoJSON object.

* [Point](#point)
* [LineString](#linestring)
* [Polygon](#polygon)
* [MultiPoint](#multipoint)
* [MultiLineString](#multilinestring)
* [MultiPolygon](#multipolygon)
* [Feature](#feature)
* [FeatureCollection](#featurecollection)
* [GeometryCollection](#geometrycollection)
* [Circle](#circle)

#### Constructor
You create new `Terraformer.Primitive` objects by passing it a valid [GeoJSON Object](). This will return the a `Terraformer.Primitive` of the type that corresponds with type of your GeoJSON object.

```js
var point = new Terraformer.Primitive({
  type:"Point",
  coordinates:[1,2]
});

point instanceof Terraformer.Point; //-> true

point.within(polygon) //-> true or false
```

#### Methods

Method | Returns | Description
--- | --- | ---
`toMercator()` | `this` | Converts this GeoJSON objects coordinates to the [web mercator spatial reference](http://spatialreference.org/ref/sr-org/6928/).
`toGeographic()` | `this` | Converts this GeoJSON objects coordinates to [geographic coordinates](http://spatialreference.org/ref/epsg/4326/).
`envelope()` | [`Envelope`]() | Return an object with `x`, `y`, `w`, `h`. Suitable for passing to most indexes.
`bbox()` | [`BBox`]() | Returns the GeoJSON Bounding Box](http://www.geojson.org/geojson-spec.html#bounding-boxes) for this primitive.
`convexHull()` | [`Polygon`]() | Returns the [convex hull](primitive) of this primitive.
`contains([<GeoJSON>]() geojson)` | `Boolean` | Returns `true` if the passed GeoJSON object is completely contains this primitive.
`within([<GeoJSON>]() geojson)` | `Boolean` | Returns `true` if the passed GeoJSON object is completely within this primitive.
`intersects([<GeoJSON>]() geojson)` | `Boolean` | Returns `true` if the passed GeoJSON intersects this primitive.

### Point
A JavaScript object representing a (GeoJSON Point)[].

#### Constructor
`Terraformer.Point` can be created by passing a [GeoJSON Coordinate Pair]() like `[longitude, latitude]`, with plain `x,y`, or a valid [GeoJSON Point]().

```js
var point1 = new Terraformer.Point({
  type:"Point",
  coordinates:[1,2]
});

var point2 = new Terraformer.Point(1,2);

var point3 = new Terraformer.Point([1,2]);
```

### MultiPoint
A JavaScript object representing a (GeoJSON MultiPoint)[].

#### Constructor

`Terraformer.MultiPoint` can be created by passing in a valid [GeoJSON MultiPoint](), or an array of [GeoJSON Coordinates]() like `[longitude, latitude]`.

```js
var multipoint1 = new Terraformer.MultiPoint({
  type:"MultiPoint",
  coordinates:[ [1,2],[2,1] ]
});

var multipoint2 = new Terraformer.MultiPoint([ [1,2],[2,1] ]);
```

#### Methods
Method | Returns | Description
--- | --- | --- |
`forEach(<Function> function)`| `null` | Iterates over each point. Equivalent to `multipoint.coordinates.forEach(function)`. The function will be called with `point`, `index` and `coordinates`.
`get(<Integer> index)` | [`Point`]() | Returns a [`Terraformer.Point`]() for the point at `index` in the coordinates array.
`addPoint([<Coordinate>]())` | `this` | Adds a new coordinate to the end of the coordinate array. Equivalent to `multipoint.coordinates.push([3,4])`.
`insertPoint([<Coordinate>](), <Integer> index)` | `this` | Inserts the passed coordinate at the passed index. Equivalent to `multipoint.coordinates.splice(index, 0, point)`
`removePoint(<Integer> index / [<Coordinate>]())` | `this` | Removes the coordinate at `index` or the passed Coordinate depending on the type of object passed in.

### LineString
A JavaScript object representing a (GeoJSON LineString)[].

#### Constructor

`Terraformer.LineString` can be created by passing in a valid [GeoJSON LineString](), or an array of [GeoJSON Coordinates]() like `[longitude, latitude]`.

```js
var linestring = new Terraformer.LineString({
  type:"LineString",
  coordinates:[ [1,2],[2,1] ]
});

var linestring = new Terraformer.LineString([ [1,2],[2,1] ]);
```

#### Methods
Method | Returns | Description
--- | --- | ---
`addVertex([<Coordinate>]())` | this | Adds a new coordinate to the end of the coordinate array. Equivalent to `linestring.coordinates.push([3,4])`.
`insertVertex([<Coordinate>](), <Integer> index)` | this | Inserts the passed coordinate at the passed index. Equivalent to `linestring.coordinates.splice(index, 0, point)`
`removeVertex(<Integer> index)` | this | Removes the coordinate at `index`. Equivalent to calling `linestring.coordinates.splice(remove, 1)`

### MultiLineString
A JavaScript object representing a (GeoJSON MultiLineString)[].

#### Constructor
`Terraformer.LineString` can be created by passing in a valid [GeoJSON MultiLineString](), or an array like `[ [[1,1],[2,2],[3,4]], [[0,1],[0,2],[0,3]] ]` The conforms to a valid coordinate array for [GeoJSON MultiLineString]().

```js
var multilinestring = new Terraformer.MultiLineString({
  type:"LineString",
  coordinates:[ [1,2],[2,1] ]
});

var multilinestring = new Terraformer.MultiLineString([ [[1,1],[2,2],[3,4]], [[0,1],[0,2],[0,3]] ]);
```

#### Methods
Method | Returns | Description
--- | --- | ---
`forEach(<Function> function)`| `null` | Iterates over each LineString. Equivalent to `multilinestring.coordinates.forEach(function)`. The function will be called with `linestring`, `index` and `coordinates`.
`get(<Integer> index)` | [`LineString`]() | Returns a [`Terraformer.LineString`]() for the LineString at `index` in the coordinates array.

### Polygon
A JavaScript object representing a (GeoJSON Polygon)[].

#### Constructor
`Terraformer.Polygon` can be created by passing in a valid [GeoJSON Polygon](), or an array that is a valid coordinate array for [GeoJSON Polygon]().

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

#### Methods
Method | Returns | Description
--- | --- | --- |
`addVertex([<Coordinate>]())` | `this` | Adds a new coordinate to the end of the coordinate array. Equivalent to `polygon.coordinates.push([3,4])`.
`insertVertex([<Coordinate>](), <Integer> index)` | `this` | Inserts the passed coordinate at the passed index. Equivalent to `polygon.coordinates.splice(index, 0, point)`
`removeVertex(<Integer> index)` | `this` | Removes the coordinate at `index`. Equivalent to calling `polygon.coordinates.splice(remove, 1)`
`close()` | `this` | Ensures that the first and last vertex of the polygon are equal to each other.

### MultiPolygon
A JavaScript object representing a (GeoJSON MultiPolygon)[].

#### Constructor
`Terraformer.MultiPolygon` can be created by passing in a valid [GeoJSON MultiPolygon](), or an array that is a valid coordinate array for [GeoJSON MultiPolygon]().

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

#### Methods
Method | Returns | Description
--- | --- | --- |
`forEach(<Function> function)`| `null` | Iterates over each LineString. Equivalent to `multipolygon.coordinates.forEach(function)`. The function will be called with `polygon`, `index` and `coordinates`.
`get(<Integer> index)` | [`Polygon`]() | Returns a [`Terraformer.Polygon`]() for the Polygon at `index` in the coordinates array.

### Feature
A JavaScript object representing a (GeoJSON Feature)[].

#### Constructor
`Terraformer.Feature` can be created by passing in a valid [GeoJSON Feature]() or [GeoJSON Geometry]().

```js
var feature1 = new Terraformer.Feature(
  type: "Feature",
  "geometry: {
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

### FeatureCollection
A JavaScript object representing a (GeoJSON FeatureCollection)[].

#### Constructor
`Terraformer.FeatureCollection` can be created by passing a valid [GeoJSON Feature Collection]() or an array of [GeoJSON Features]().

```js
var featurecollection1 = new Terraformer.FeatureCollection(
  "type": "FeatureCollection",
  "features": [feature1, feature2]
});

var featurecollection2 = new Terraformer.FeatureCollection([feature1, feature2]);
```

#### Methods
Method | Returns | Description
--- | --- | ---
`forEach(<Function> function)`| `null` | Iterates over each Feature. Equivalent to `featurecollection.features.forEach(function)`. The function will be called with `featyre`, `index` and `coordinates`.
`get(<Integer> index)` | [`Primitive`]() | Returns a [`Terraformer.Primitive`]() for the Feature at `index` in the features array.

### GeometryCollection
A JavaScript object representing a (GeoJSON GeometryCollection)[].

#### Constructor
`Terraformer.GeometryCollection` can be created by passing a valid [GeoJSON Geometry Collection]() or an array of [GeoJSON Geometries]().

```js
var geometrycollection1 = new Terraformer.GeometryCollection(
  "type": "FeatureCollection",
  "features": [geometry1, geometry2]
});

var geometrycollection2 = new Terraformer.GeometryCollection([geometry1, geometry2]);

#### Methods
Method | Returns | Description
--- | --- | ---
`forEach(<Function> function)`| `null` | Iterates over each LineString. Equivalent to `geometrycollection.coordinates.forEach(function)`. The function will be called with `geometry`, `index` and `coordinates`.
`get(<Integer> index)` | [`Primitive`]() | Returns a [`Terraformer.Primitive`]() for the Geometry at `index` in the coordinates array.

### Circle
The GeoJSON spec does not provide a way to visualize circles. `Terraformer.Circle` is actual a [GeoJSON Feature]() object that contains a Polygon representing a circle with a certain number of sides.

#### Constructor
`Terraformer.Circle` is created with a `center`, `radius`, and `steps`.

Option | Type | Default | Description
--- | --- | --- | --- |
`center` | [`Coordinate`]() | null | **Required** A [GeoJSON Coordinate]() in `[x,y]` format.
`radius` | `Integer` | 250 | The radius of the circle in meters.
`interpolate` | `Integer` | 32 | How many steps will be used to create the polygon that represents the circle.

```js
circle = new Terraformer.Circle([45.65, -122.27], 500, 64);

circle.contains(point);
```

#### Methods
Method | Returns | Description
--- | --- | ---
`recalculate()` | this | Recalculates the
`steps(<Integer> steps)` | `Integer` | The number of steps to produce the Polygon representing the circle.
`radius(<Integer> radius)` | `Integer` | The radius of the circle in meters.
`center(<[`Coordinates`]()> center)` | [`Coordinates`]() | Sets a new center to the circle and recalculate the polygon.

## Tools
Terraformer also has numerous helper methods for working with GeoJSON and geographic data.

### Spatial Reference Conversions
Method | Returns | Description
--- | --- | ---
`toMercator(geojson)` | `GeoJSON` | Converts this GeoJSON objects coordinates to the [web mercator spatial reference](http://spatialreference.org/ref/sr-org/6928/). This is an in place modification of the passed object.
`toGeographic(geojson)` | `GeoJSON` | Converts this GeoJSON objects coordinates to [geographic coordinates](http://spatialreference.org/ref/epsg/4326/). This is an in place modification of the passed object.
`applyConverter(geojson, function)` | `GeoJSON` | runs the passed `function`against every [`Coordinate`]() in the `geojson` object. Your `function` will be passed a [`Coordinate`]() and will be expected to return a [`Coordinate`]().
`positionToMercator(coordinate)` | `Coordinate` | Converts the passed [`Coordinate`]() to [web mercator spatial reference](http://spatialreference.org/ref/sr-org/6928/).
`positionToGeographic(coordinate)` | [`Coordinate`]() | Converts the passed [`Coordinate`]() to to [geographic coordinates](http://spatialreference.org/ref/epsg/4326/).

### Calculations
Method | Returns | Description
--- | --- | ---
`calculateBounds(geojson)` | [`BBox`](/glossary#bbox) | Returns a [`GeoJSON bounding box`](/glossary#bbox) for the passed geojson.
`calculateEnvelope(geojson)` | [`Envelope`](/glossary#envelope) | Return an object with `x`, `y`, `w`, `h`. Suitable for passing to most indexes.
`convexHull(geojson)` | [`Coordinates`](/glossary#geojson-coordinates) | Returns an array of [`coordinates`](/glossary#geojson-coordinates) representing the [convex hull](http://en.wikipedia.org/wiki/Convex_hull) the the passed geojson.

### Comparisons
Method | Returns | Description
--- | --- | ---
`coordinatesContainPoint(coordinates, coordinates)` | `Boolean` |  Accepts a [`coordinate`](/glossary#geojson-coordinates) array and a [`coordinate`](/glossary#geojson-coordinate) and returns `true` if the point falls within the coordinate array.
`polygonContainsPoint(polygon, coordinate)` | `Boolean` | Accepts a [Polygon](/glossary#geojson-polygon) and a [`coordinate`](/glossary#geojson-coordinate) and returns `true` if the point falls within the polygon.
`arrayIntersectsArray(coordinates, coordinates)` | `Boolean` | Accepts two arrays of [`coordinates`](/glossary#geojson-coordinates) and returns true if they cross each other at any point.
`coordinatesEqual(coordinate, coordinate)` | `Boolean` | Accepts two [`coordinates`](/glossary#geojson-coordinate) and returns `true` if the passed coordinates are equal to each other.
