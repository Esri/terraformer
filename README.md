Terraformer
===========

* Convert to and from ArcGIS JSON Geometries, WKT and GeoJSON
* Manipulate GeoJSON with methods like `addVertex`
* Find out if GeoJSON shapes intersect or contain each other
* Get properties like bounding boxes, envelopes, and convex hull of GeoJSON objects
* Respresent circles as GeoJSON Features
* Convert to and from [Geographic Coordinates](http://spatialreference.org/ref/epsg/4326/) and [Esri Web Mercator](http://spatialreference.org/ref/sr-org/6928/) spatial references

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

### AMD (Require.js and Dojo)

Terraformer also works with AMD loaders like [RequireJS](http://requirejs.org/) and [Dojo](http://dojotoolkit.org/).

##### RequireJS

First you should register the Terraformer modules with RequireJS

    requirejs.config({
      //In order for proper loading of depenencies in Terraformer modules set the path up in requirejs.config
      paths: {
        terraformer: "/the/path/to/terraformer"
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

##### Dojo

Dojo includes a built in AMD loader. To use Terraformer with Dojo setup the path to Terraformer in your `dojoConfig`.

    dojoConfig= {
      async: true,
      packages: [{
        name: "terraformer",
        location: "/the/path/to/terraformer"
      }]
    }

You can then include Terraformer in your Dojo code

    require([
      "terraformer/terraformer",
      "terraformer/arcgis",
      "terraformer/rtree",
    ], function (Terraformer, TerraformerArcGIS, RTree) {
      // Do stuff with terraformer core, arcgis parser, and rtree
    });

### WebWorkers

Sample code and examples coming soon...

## Documentation

### Basics

* [Primitives](docs/Primitives.md)

### Parsers

* [ArcGIS](docs/ArcGIS.md)
* [Well Known Text](https://github.com/esri/terraformer-parser-wkt)
* [GeoJSON](docs/GeoJSON.md)

### Indexes

* [Indexes](docs/Indexes.md)

### Tools

* [Tools](docs/Tools.md)
* [Geostore](docs/GeoStore.md)

## Examples
* [Visualize and search US County data with the ArcGIS Javascript API and `Terraformer.GeoStore`](https://github.com/Esri/Terraformer/tree/master/examples/counties)
* [View GeoJSON on and ArcGIS map with Terraformer](https://github.com/Esri/Terraformer/tree/master/examples/geojson-viewer)
* [Visualize Well Known text on a Google map](https://github.com/Esri/Terraformer/tree/master/examples/googlemaps-wkt)
* [Use Terraformer with Require JS and Leaflet](https://github.com/Esri/Terraformer/tree/master/examples/require-js-leaflet)
* [Create a simple timezone API with Terraformer and Node JS](https://github.com/Esri/Terraformer/tree/master/examples/timezone)
* [Visualize Well Known Text with the ArcGIS Javascript API and `Terraformer.RTree`](https://github.com/Esri/Terraformer/tree/master/examples/wkt-viewer)

## Testing
Tests are written in Jasmine and can be run through `$ grunt` or `$ npm install` then `$ npm test`. To run the tests run the following commands to setup PhantomJS and Grunt...

* `$ npm install grunt -g`
* `$ brew install phantomjs`

Then run the tests with `$ grunt` which will buld all the files and then run the tests. You can also run `$ grunt watch` which will run the tests when source files change.

## Building

Running the `$ grunt build_source` command will build the libraries to `dist/node` and `dist/browser`.

## Future Features
* GeoJSON validation
* Google Maps format support
* Leaflet format support

## Known Issues
The following are known issues that we have acknowledged but have not or will not fix. See individual issues for details.
* Convert an array of ArcGIS Geometries/Graphics to a GeometryCollection/FeatureCollection. [https://github.com/Esri/Terraformer/issues/104](https://github.com/Esri/Terraformer/issues/104)

[](Esri Tags: Terraformer GeoJSON WKT Well-Known-Text)
[](Esri Language: JavaScript)
