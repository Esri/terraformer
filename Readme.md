# Terraformer

#### Key Features

* Conversion to and from ArcGIS Geometries to GeoJSON
* Supports both (Geographic)[http://spatialreference.org/ref/epsg/4326/] and (Esri web mercator)[http://spatialreference.org/ref/sr-org/6928/] spatial references

### Converting Between ArcGIS and GeoJSON

```javascript
// ArcGIS To Geojson
Terraformer.toGeoJSON(arcgisGeometry);

// GeoJSON To ArcGIS
Terraformer.toArcGIS(geoJSON);

// GeoJSON to ArcGIS with Custom Spatial Reference
Terraformer.toArcGIS(geoJSON, { wkid:102100 });
```

### Converting Spatial References
```javascript
// Convert the GeoJSON object to Web Mercator
Terraform.toMercator(geojson);

// Convert the GeoJSON object to Geographic
Terraform.toGeographic(geojson);
```

# Node Tests
If you want to run the node tests just `npm test` or `npm install` then `grunt node`

# Browser Tests

Testing is done via [Grunt](http://gruntjs.com/) and [Phantom JS](http://phantomjs.org/). To install these just run...

If you want to run the tests in a browser with `grunt` or `grunt jasmine` you will need to install Phantom JS and grunt.

* `npm install grunt -g`
* `brew install phantomjs`

Once these are installed you can now run the tests with `grunt browser`.

If you do not want to run tests from the command line just open up `spec/SpecRunner.html` in your browser.

# Building

Make sure you have all the development dependancies installed with `npm install` then run `grunt` from the command line. If the files lints and passes all the tests it will be concatinated and minified to the `dist` folder and a versioned filename to the `versions` folder.

### Todos
* Convert FeatureCollections and GeometryCollections to arrys of ArcGIS geometries
* Convert an array of ArcGIS Geometries to a GeometryCollections
* Make a `isMercator()` and `isGeographic()` function