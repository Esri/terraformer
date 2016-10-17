# Terraformer

[![Build Status](https://travis-ci.org/Esri/Terraformer.svg?branch=master)](https://travis-ci.org/Esri/Terraformer)

> A modular toolkit for working with geographic data.

## Modules

The Terraformer project is broken up into a series of smaller modules.

* [Terraformer Core](http://terraformer.io/core/) - Contains methods and objects for working with GeoJSON. This also contains common methods used by other modules.
* [WKT Parser](http://terraformer.io/wkt-parser/) - Parse Well Known Text into GeoJSON and vice versa.
* [ArcGIS Geometry Parser](http://terraformer.io/arcgis-parser/) - Parse the [ArcGIS Geometry Format](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/) into GeoJSON and vice versa.
* [GeoStore](http://terraformer.io/geostore/) - A framework for persisting and querying GeoJSON features with pluggable indexes and persistent stores.

## Features

* Designed to work in Node and the browser
* No dependencies on other tools or libraries

## Getting Started

Check out the getting [started guide](http://terraformer.io/getting-started/) which will give you an overview of core concepts and methods in Terraformer.

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

## Documentation

Make sure you check out the full documentation on the [Terraformer website](http://terraformer.io/core/) and the [getting started guide](http://terraformer.io/getting-started/).

```js
var polygon = new Terraformer.Primitive({
  "type": "Polygon",
  "coordinates": [
    [
      [-122.665894, 45.5229015],
      [-122.669263, 45.5229165],
      [-122.671151, 45.5184062],
      [-122.673254, 45.5140008],
      [-122.668426, 45.5127378],
      [-122.667654, 45.5169478],
      [-122.665894, 45.5229015]
    ]
  ]
});

var point = new Terraformer.Primitive({
  "type": "Point",
  "coordinates": [-122.669477, 45.517760]
});
```

Now that you have a point and a polygon primitive you can use the primitive helper methods.

```js
// add a new vertex to our polygon
polygon.insertVertex([-122.670851, 45.513189], 2);

// figure out if our point is within our polygon
point.within(polygon); // returns true
```

You can also have Terraformer perform many geometric operations like convex hulls and bounding boxes.

```js
var convexHull = polygon.convexHull();

point.within(convexHull); // returns true

var boundingBox = polygon.bbox(); // returns the geojson bounding box for this object.
```

## Resources

* [Terraformer Website](http://terraformer.io)
* [twitter@EsriPDX](http://twitter.com/esripdx)

## Building the documentation

To build the site locally, first `bundle install` then `bundle exec middleman` to run a local server. Maintainers can run `bundle exec middleman build`, then `grunt gh-pages` to deploy to github pages.

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

[](Esri Tags: Terraformer GeoJSON)
[](Esri Language: JavaScript)
