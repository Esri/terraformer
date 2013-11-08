Terraformer
===========

* Convert to and from ArcGIS JSON Geometries, WKT and GeoJSON
* Manipulate GeoJSON with methods like `addVertex`
* Find out if GeoJSON shapes intersect or contain each other
* Get properties like bounding boxes, envelopes, and convex hull of GeoJSON objects
* Respresent circles as GeoJSON Features
* Convert to and from [Geographic Coordinates](http://spatialreference.org/ref/epsg/4326/) and [Esri Web Mercator](http://spatialreference.org/ref/sr-org/6928/) spatial references

[View browser examples here](http://esri.github.com/Terraformer/examples/browser/index.html)

Gizipped and minified all Terraformer modules comes to about 9.6kb. The core library is 2.8kb and includes GeoJSON parsing, helper methods, bounding boxes and spatial reference conversions. Other features are available as add-in modules as needed.

## Using

### Node.js
Terraformer on Node.js is split into multiple small packages for easy consumption.

    $ npm install terraformer
    $ npm install terraformer-rtree
    $ npm install terraformer-wkt-parser
    $ npm install terraformer-arcgis-parser

### Browser

Terraformer can be used in the browser with a simple browser include.

    <!-- Load the main terraformer library -->
    <script src="terraformer.min.js" type="text/javascript"></script>

    <!-- Load the wkt parser -->
    <script src="wkt.min.js" type="text/javascript"></script>

    <!-- Load the arcgis parser -->
    <script src="arcgis.min.js" type="text/javascript"></script>

    <!-- Load the rtree index -->
    <script src="rtree.min.js" type="text/javascript"></script>

### WebWorkers

Sample code and examples coming soon...

## Documentation

### Basics

* [Primitives](docs/documents/Primitives.html.md)

### Parsers

* [ArcGIS](docs/documents/arcgis-parser.html.md)
* [Well Known Text](https://github.com/esri/terraformer-parser-wkt)
* [GeoJSON](docs/documents/GeoJSON.html.md)

### Indexes

* [Indexes](docs/documents/Indexes.html.md)

### Tools

* [Tools](docs/documents/Tools.html.md)
* [Geostore](docs/documents/GeoStore.html.md)

## Examples
* [Visualize and search US County data with the ArcGIS Javascript API and `Terraformer.GeoStore`](http://esri.github.com/Terraformer/examples/browser/index.html)
* [View GeoJSON on and ArcGIS map with Terraformer](http://esri.github.com/Terraformer/examples/browser/index.html)
* [Visualize Well Known text on a Google map](http://esri.github.com/Terraformer/examples/browser/index.html)
* [Use Terraformer with Leaflet](http://esri.github.com/Terraformer/examples/browser/index.html)
* [Visualize Well Known Text with the ArcGIS Javascript API and `Terraformer.RTree`](http://esri.github.com/Terraformer/examples/browser/index.html)
* [Create a simple timezone API with Terraformer and Node JS](https://github.com/Esri/Terraformer/tree/master/examples/timezone)

## Testing
Tests are written in Jasmine and can be run through `$ grunt` or `$ npm install` then `$ npm test`. To run the tests run the following commands to setup PhantomJS and Grunt...

* `$ npm install grunt -g`
* `$ brew install phantomjs`

Then run the tests with `$ grunt` which will buld all the files and then run the tests. You can also run `$ grunt watch` which will run the tests when source files change.

## Building

Running the `$ grunt build` command will build the libraries to `dist/node` and `dist/browser`. If you want to build with a different version number run `$ grunt build-versioned`.

## Future Features
* GeoJSON validation
* Google Maps format support
* Leaflet format support

## Known Issues
The following are known issues that we have acknowledged but have not or will not fix. See individual issues for details.
* Convert an array of ArcGIS Geometries/Graphics to a GeometryCollection/FeatureCollection. [https://github.com/Esri/Terraformer/issues/104](https://github.com/Esri/Terraformer/issues/104)

[](Esri Tags: Terraformer GeoJSON WKT Well-Known-Text)
[](Esri Language: JavaScript)
