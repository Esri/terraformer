---
title: Getting Started
layout: documentation
---
# Terraformer

<!-- table_of_contents -->

Terraformer is an open source (MIT licensed) Javascript geo toolkit, built for the server and the browser.

## Getting Started

Terraformer is broken into multiple small packages to give you the functionality you need while still remaining extremely lightweight.

There are currently several packages in the Terraformer ecosystem.

* [Terraformer](/core/) - The core library for manipilating GeoJSON and performaing calculations. Most other modules rely on `terraformer`.
* [ArcGIS Parser](/arcgis-parser/) - Parses ArcGIS geometry objects to GeoJSON and vice-versa.
* [WKT Parser](/wkt-parser/) - Parses basic WKT (Well Known Text) strings to and from GeoJSON.
* [GeoStore](/geostore/) - A JavaScript database for storing and querying collections of GeoJSON Features. GeoStores also need an index module and a backing store which are distributed as seperate modules.

### Node.js

Install the core module with NPM and then require it in your Node program.

```
$ npm install terraformer
```

```js
var Terraformer = require('terraformer');
```

If needed, supporting packages can be added too.

```js
require('terraformer-arcgis-parser');
require('terraformer-wkt-parser');
require('terraformer-geostore');
```

### Browser

To use the Terraformer library, include a reference to it using a `<script>` tag.

```html
<script src="http://cdn-geoweb.s3.amazonaws.com/terraformer/1.0.4/terraformer.min.js"></script>
```

To utilize supporting packages, you must load their source as well.

```html
<script src="terraformer-arcgis-parser.min.js"></script> <!-- https://github.com/Esri/terraformer-arcgis-parser -->
<script src="terraformer-wkt-parser.min.js"></script> <!-- https://github.com/Esri/terraformer-wkt-parser -->
<script src="terraformer-geostore.min.js"></script> <!-- https://github.com/Esri/terraformer-geostore -->
```

## Working with Primitives

Most of the core Terraformer libray centers around using [`Primitives`](/core/#terraformerprimitive), which wrap GeoJSON objects and provide additional functionality.

You can create a new [Terraformer.Primitive](/core/#terraformerprimitive) with any GeoJSON object.

```js

var polygon = new Terraformer.Primitive({
  "type": "Polygon",
  "coordinates": [
    [
      [-122.66589403152467, 45.52290150862236],
      [-122.66926288604736, 45.52291654238294],
      [-122.67115116119385, 45.518406234030586],
      [-122.67325401306151, 45.514000817199715],
      [-122.6684260368347, 45.5127377671934],
      [-122.66765356063841, 45.51694782364431],
      [-122.66589403152467, 45.52290150862236 ]
    ]
  ]
});

var point = new Terraformer.Primitive({
  "type": "Point",
  "coordinates": [-122.66947746276854, 45.51775972687403]
});
```

Now that you have a point and a polygon primitive, you can use many of the primitive helper methods.

```js
// add a new vertex to our polygon
polygon.insertVertex([-122.6708507537842, 45.513188859735436], 2);

// figure out if our point is within our polygon
point.within(polygon); // returns true
```

You can also have Terraformer perform many geometric operations like convex hulls and bounding boxes.

```js
var convexHull = polygon.convexHull();

point.within(convexHull); // returns true

var boundingBox = polygon.bbox(); // returns the geojson bounding box for this object.
```

## Whats Next?

Start exploring all the options you have working with [Primitives](/core/#terraformerprimitive) and the core library. Then start exploring other modules.

[Terraformer GeoStore](/geostore/) is a JavaScript database for indexing and querying large amounds of GeoJSON. You can use multiple types of spatial indexes and backing stores for your data.

You can also convert data between different formats like [ArcGIS Geometries](/arcgis-parser/) and [Well Known Text](/wkt-parser/). Remember Terraformer is a modular framework, so use only the pieces you need to complete your applicaiton.
