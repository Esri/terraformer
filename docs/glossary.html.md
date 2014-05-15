---
title: Glossary
layout: documentation
---

# Glossary

<!-- table_of_contents -->

## GeoJSON

Terraformer uses the [GeoJSON specification](http://geojson.org/geojson-spec.html) as a guide on how to format all representation of geographical data.

### Coordinate

A coordinate is the building block for the rest of the GeoJSON specification. It is represented by an array of `x`, `y` integers. The ordering of `x` and `y` are important, this means that when representing latitude and longitiude the order is `[longitude, latitude]`.

```js
[-122.680, 45.528]
```

[GeoJSON Coordinate](http://geojson.org/geojson-spec.html#positions)

### Coordinates

A series of [Coordinate](#coordinate) objects that are used to define a line or polygon.

```js
[ 
  [-122.680, 45.58] 
  [-123.230, 45.62] 
  [-122.80, 45.22] 
]
```

[GeoJSON Coordinate](http://geojson.org/geojson-spec.html#positions)

### Bbox

A GeoJSON bounding box is usually a 4-item array representing the rectangle that will contain the GeoJSON object.

```js
[-122.70, 45.51, -122.64, 45.53]
```

[GeoJSON BBox](http://geojson.org/geojson-spec.html#bounding-boxes)

### Geometry
"GeoJSON Geometry" refers to any of the single geometry objects from the geoJSON specification like [Point](#point), [MultiPoint](#multiPoint), [LineString](#linestring), [MultiLineString](#multilinestring), [Polygon](#polygon), or [MultiPolygon](#multipolygon).

[GeoJSON Geometry](http://geojson.org/geojson-spec.html#geometry-objects)

### Point

An object representing a single point.

```json
{
  "type": "Point",
  "coordinates": [-105.01621,39.57422]
}
```

[GeoJSON Point](http://geojson.org/geojson-spec.html#point)

### MultiPoint

An object represeneting multiple points as a single coordinate array.

```json
{
  "type": "MultiPoint",
  "coordinates": [ [-105.01,39.57],[-80.66,35.05] ]
}
```

[GeoJSON MultiPoint](http://geojson.org/geojson-spec.html#multipoint)

### LineString

A series of coordinates that form a line.

```json
{
  "type": "LineString",
  "coordinates": [ 
    [-101.5,39.662],
    [-101.75,39.2415],
    [-101.64,39.2415],
  ]
}
```

[GeoJSON LineString](http://geojson.org/geojson-spec.html#linestring)

### MultiLineString

An object that represents multiple linestrings in a single object.

```json
{
  "type": "MultiLineString",
  "coordinates": [ 
    [
      [-101.5,39.662],
      [-101.75,39.2415],
      [-101.23,39.2415],
      [-101.749,39.7984],
      [-101.5,39.011]
    ],[
      [-99.23,38.6605],
      [-99.56,38.727],
      [-99.25,38.018]
    ],[
      [-98.499,38.913],
      [-98.499,38.913],
      [-98.38.,38.15],
      [-97.5,38.629] 
    ]
  ]
}
```

[GeoJSON MultiLineString](http://geojson.org/geojson-spec.html#multilinestring)

### Polygon

An array of coordinates defining a polygon.

```json
{
  "type": "Polygon",
  "coordinates": [
    [ [41.83,71.01],[56.95,33.75],[21.79,36.56],[41.83,71.01] ]
  ]
}
```

[GeoJSON Polygon](http://geojson.org/geojson-spec.html#polygon)

### MultiPolygon

An object that represents multiple polygons in a single object.

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
    ],
    [
      [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
    ]
  ]
}
```

[GeoJSON MultiPolygon](http://geojson.org/geojson-spec.html#multipolygon)

### Feature

GeoJSON Features combine a [Geometry](#geometry) object with a unique identifier and set of metadata.

```json
{
  "type": "Feature",
  "id": "stadium",
  "geometry": {
    "type": "Point",
    "coordinates": [-104.99404, 39.75621]
  },
  "properties": {
    "name": "Coors Field",
    "amenity": "Baseball Stadium",
    "popupContent": "This is where the Rockies play!"
  }
}
```

[Feature](http://geojson.org/geojson-spec.html#feature-objects)

### FeatureCollection

Contains multiple [Features](#feature) objects in a single object.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-80.83775386582222,35.24980190252168]
      },
      "properties": {
        "name": "DOUBLE OAKS CENTER",
        "address": "1326 WOODWARD AV"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-80.83827000459532,35.25674709224663]
      },
      "properties": {
        "name": "DOUBLE OAKS NEIGHBORHOOD PARK",
        "address": "2605  DOUBLE OAKS RD"
      }
    }
  ]
}
```

[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)

### GeometryCollection

Contains multiple [Geometry](#geometry) objects in a single object.

```json
{
  "type": "GeometryCollection",
  "geometries": [{
    "type": "Polygon",
    "coordinates": [
      [ [41.83,71.01],[56.95,33.75],[21.79,36.56],[41.83,71.01] ]
    ]
    },{
      "type": "MultiPoint",
      "coordinates": [ [100, 0],[45, -122] ]
    }
  ]
}
```

[GeometryCollection](http://geojson.org/geojson-spec.html#geometry-collection)

## Terraformer Primitives

[Terraformer Primitives](/documentation/core/#Primitive) wrap their [GeoJSON](#geojson) counterparts to provide extra functionality.

### Point Primitive

An object respresenting a [GeoJSON Point](#point)

[Point](/documentation/core/#point)

### MultiPoint Primitive

An object respresenting a [GeoJSON MultiPoint](#multipoint)

[MultiPoint](/documentation/core/#multipoint)

### LineString Primitive

An object respresenting a [GeoJSON LineString](#lineString)

[LineString](/documentation/core/#linestring)

### MultiLineString Primitive

An object respresenting a [GeoJSON MultiLineString](#multilinestring)

[MultiLineString](/documentation/core/#multilinestring)

### Polygon Primitive

An object respresenting a [GeoJSON Polygon](#polygon)

[Polygon](/documentation/core/#polygon)

### MultiPolygon Primitive

An object respresenting a [GeoJSON MultiPolygon](#multipolygon)

[MultiPolygon](/documentation/core/#multipolygon)

### Feature Primitive

An object respresenting a [GeoJSON Feature](#feature)

[Feature](/documentation/core/#feature)

### FeatureCollection Primitive

An object respresenting a [GeoJSON FeatureCollection](#featurecollection)

[FeatureCollection](/documentation/core/#featurecollection)

### GeometryCollection Primitive

An object respresenting a [GeoJSON GeometryCollection](#geometrycollection)

[GeometryCollection](/documentation/core/#geometrycollection)

### Circle Primitive

An object representing a [GeoJSON Feature](#feature) which contains a polygonal representation of a circle.

[Circle](/documentation/core/#circle)

## Misc

### Envelope

Envelopes are a common structure for indexes like Terraformer.RTree.

```js
{
  x: 1,
  y: 1,
  w: 15
  h: 15
}
```

### Convex Hull

Convex

```js
{
  x: 1,
  y: 1,
  w: 15
  h: 15
}
```