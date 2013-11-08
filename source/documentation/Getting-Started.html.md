---
layout: documentation
---

# Terraformer

Terraformer is an open source (MIT licensed) Javascript geo toolkit, built for the server and the browser.

## Getting Started

Terraformer is broken into multiple small packages to give you the functionality that you need while still remaining extremely lightweight.

### Browser

Terraformer can be used in the browser with a simple browser include.

    <!-- Load the main terraformer library -->
    <script src="terraformer.min.js" type="text/javascript"></script>

    <!-- Load the wkt parser -->
    <script src="wkt.min.js" type="text/javascript"></script>

    <!-- Load the arcgis parserindex -->
    <script src="arcgis.min.js" type="text/javascript"></script>

    <!-- Load the rtree index -->
    <script src="rtree.min.js" type="text/javascript"></script>

### AMD (Require.js and Dojo)

Terraformer also works with AMD loaders like [RequireJS](http://requirejs.org/) and [Dojo](http://dojotoolkit.org/).

##### RequireJS

First you should register the Terraformer modules with RequireJS

    requirejs.config({
      //In order for proper loading of depenencies in Terraformer modules set the path up in requirejs.config
      paths: {
        terraformer: "the/path/to/terraformer"
      }
    });

Then you can load Terraformer modules in your `require` statements.

    requirejs([
      "terraformer/terraformer",
      "terraformer/wkt",
      "terraformer/rtree",
    ], function (Terraformer, TerraformerWKT, RTree) {
      // Do stuff with terraformer core, wkt parser, and rtree
    };

### Node.js

Using Terraformer in Node.js is easy.

    $ npm install terraformer
    $ npm install terraformer-wkt-parser
    $ npm install terraformer-arcgis-parser
    $ npm install terraformer-rtree

Writing code is easy too:

    var Terraformer = require('terraformer');

    var Polygon = new Terraformer.Polygon();

### WebWorkers

Documentation Coming Soon...

## Specifics

### Basics

* [Primitives](Primitives.md)

### Parsers

* [ArcGIS](ArcGIS.md)
* [Well Known Text](https://github.com/esri/terraformer-wkt-parser)
* [GeoJSON](GeoJSON.md)

### Indexes

* [Indexes](Indexes.md)

### Tools

* [Tools](Tools.md)
* [Geostore](GeoStore.md)