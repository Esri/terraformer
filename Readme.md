# Terraformer
Terraformer is a small javascript library for working with GeoJSON. It is designed to be fast lightweight and usable in large numbers of environments including, browsers, AMD (require.js or Dojo), Node.js and inside Web Workers.

* Convert to and from ArcGIS JSON Geometries, WKT and GeoJSON
* Manipulate GeoJSON with methods like `addVertex`
* Calculate bounding boxes for GeoJSON objects
* Find out if GeoJSON shapes intersect or contain each other
* Get properties like area, distance, and length of GeoJSON objects
* Respresent circles as GeoJSON Features
* Convert to and from (Geographic Coordinates)[http://spatialreference.org/ref/epsg/4326/] and (Esri Web Mercator)[http://spatialreference.org/ref/sr-org/6928/] spatial references

Gizipped and minified Terraformer comes to about 6kb.

## Using

### Node.js
Terraformer on Node.js is split into multiple small packages for easy consumption.

    $ npm install terraformer
    $ npm install terraformer-rtree
    $ npm install terraformer-wkt-parser
    $ npm install terraformer-arcgis-parser
    

## Testing
Tests are written in Jasmine and can be run through `$ grunt` or `$ npm install` then `$ npm test`. To run the tests run the following commands to setup PhantomJS and Grunt...

* `$ npm install grunt -g`
* `$ brew install phantomjs`

Then run the tests with `$ grunt` which will buld all the files and then run the tests. You can also run `$ grunt watch` which will run the tests when source files change.

## Building

Running the `$ grunt build` command will build the libraries to `dist/node` and `dist/browser`. If you want to build with a different version number run `$ grunt build-versioned`.

## Future Features
* `Terraformer.GeoStore`
* * `new Terraformer.Stores.Memory`
* * `new Terraformer.Stores.LocalStorage`
* * `new Terraformer.Stores.WebSQL`
* * `new Terraformer.Stores.PostGIS`
* GeoJSON validation
* Convert FeatureCollections and GeometryCollections to arrys of ArcGIS geometries
* Convert an array of ArcGIS Geometries to a GeometryCollections
* `Terraformer.Tools.isMercator` and `Terraformer.Tools.isGeographic`

## Interface
```javascript
new Terraformer.Position()
new Terraformer.Point()
new Terraformer.MultiPoint()
new Terraformer.LineString()
new Terraformer.MultiLineString()
new Terraformer.Polygon()
new Terraformer.MultiPolygon()
new Terraformer.Feature()
new Terraformer.FeatureCollection()
new Terraformer.GeometryCollection()
new Terraformer.Circle()

new Terraformer.ArcGIS.parse(arcgis);
new Terraformer.ArcGIS.to(geojson);
new Terraformer.WKY.parse(wkt);

new Terraformer.RTree(json);

new Terraformer.GeoStore(store);
new Terraformer.Stores.Local(namespace);
new Terraformer.Stores.Memory(namespace);
new Terraformer.Stores.WebSQL(namespace);
new Terraformer.Stores.PostGIS(namespace);

// Does shape one contain shape 2?
Terraformer.Tools.contains(shape1, shape2)

// Does shape one intersect shape 2?
Terraformer.Tools.intersects(shape1, shape2);

// Creates a 32 point polygon representing a circle

Terraformer.Tools.createCircle([x,y], radius, steps=64);
```