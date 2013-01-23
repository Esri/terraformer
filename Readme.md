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
    
### Browsers

Sample code and examples coming soon...

### AMD

Sample code and examples coming soon...

### WebWorkers

Sample code and examples coming soon...

## Testing
Tests are written in Jasmine and can be run through `$ grunt` or `$ npm install` then `$ npm test`. To run the tests run the following commands to setup PhantomJS and Grunt...

* `$ npm install grunt -g`
* `$ brew install phantomjs`

Then run the tests with `$ grunt` which will buld all the files and then run the tests. You can also run `$ grunt watch` which will run the tests when source files change.

## Building

Running the `$ grunt build` command will build the libraries to `dist/node` and `dist/browser`. If you want to build with a different version number run `$ grunt build-versioned`.

## Future Features/Known Issues
* Storeage API that combines RTree with backend stores like PostGIS/Localstorage/IndexedDB
* GeoJSON validation
* Convert FeatureCollections and GeometryCollections to arrys of ArcGIS geometries/graphics
* Convert an array of ArcGIS Geometries/Graphics to a GeometryCollection/FeatureCollection
* Convert Features to ArcGIS Graphics. [Issue](https://github.com/geoloqi/Terraformer/issues/29)
* Proper handling of holes in polygons/multipolygons when making ArcGIS <-> GeoJSON conversions. [Issue](https://github.com/geoloqi/Terraformer/issues/30)
