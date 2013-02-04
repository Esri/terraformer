# Terraformer

Terraformer is an open source (MIT licensed) Javascript geo toolkit, built for the server and the browser.

## Getting Started

Terraformer is broken into multiple small packages to give you the functionality that you need while still remaining extremely lightweight.

### Browser

Terraformer can be used in the browser with a simple browser include.

    <script src="terraformer.min.js" type="text/javascript"></script>

### Node.js

Using Terraformer in Node.js is easy.

    $ npm install terraformer
    $ npm install terraformer-wkt-parser
    $ npm install terraformer-arcgis-parser
    $ npm install terraformer-rtree

Writing code is easy too:

    var Terraformer = require('terraformer');
    
    var Polygon = new Terraformer.Polygon();

## Specifics

### Basics

* [Primitives](Primitives.md)

### Parsers

* [ArcGIS](ArcGIS.md)
* [Well Known Text](WKT.md)
* [GeoJSON](GeoJSON.md)

### Indexes

* [Indexes](Indexes.md)

### Tools

* [Tools](Tools.md)