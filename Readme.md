# Terraformer

#### Key Features

* Cient-side conversion to and from ArcGIS Geometries to GeoJSON
* Supports both (Geographic)[http://spatialreference.org/ref/epsg/4326/] and (Esri web mercator)[http://spatialreference.org/ref/sr-org/6928/]

### Converting

```
// ArcGIS To Geojson
Terraformer.toGeoJSON(arcgisGeometry);

// GeoJSON To ArcGIS
Terraformer.toArcGIS(geoJSON);

// GeoJSON to ArcGIS with Custom Spatial Reference
Terraformer.toArcGIS(geoJSON, { wkid:102100 });
```

### Tests
Just open the `SpecRunner.html` file in the `spec` folder and open it in your web browser. Support for running tests with Grunt/PhantomJS is coming soon.

### Todos
* Make this work in Node.js
* Convert FeatureCollections and GeometryCollections to arrys of ArcGIS geometries
* Make a `isMercator()` and `isGeographic()` function