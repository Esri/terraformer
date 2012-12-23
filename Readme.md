# Terraformer

#### Key Features

* Cient-side conversion to and from ArcGIS Geometries to GeoJSON
* Supports both geographic and web mercator
* 

### Configuration

Terraformer exposes the following default configuration that you can override. You can override these defaults on a per converion basis.

```
Terraformer.config = {
  stringifyGeoJSON: false,
  returnFeatures: false,
  outputSpatialReference: {
    wkid: 102100
  }
};
```

* `stringifyGeoJSON` if `true` this will return all GeoJSON as strings.
* `returnFeatures`   `if` `true` will return GeoJSON features with bounding boxes.
* `outputSpatialReference` will set the default spatial reference for ArcGIS output. Should be set to a JSON object or instance of `esri.SpatialReference`.

### Converting

```
// Basic
Terraformer.toArcGIS(geoJSON);

// With Options
Terraformer.toArcGIS(geoJSON, {
  spatialReference: new esri.spatialReference(4326);
});
```

```
// Basic
Terraformer.toGeoJSON(arcgisGeometry);

// Basic
Terraformer.toArcGIS(arcgisGeometry, {
  stringify: true,
  feature: true
});
```

### Tests
Just open the `SpecRunner.html` file in the `spec` folder and open it in your web browser. Support for running tests with Grunt/PhantomJS is coming soon.

### Notes
* This requires that the ESRI ArcGIS library be loaded BEFORE terraformer.js
* The full GeoJSON spec is not supported as there is no ArcGIS equivilant to `GeometryCollection` or `FeatureCollection`
* Geojson input/output is assumed to be in WGS84 (Also called Geographic, LatLng, or 4326)
* ArcGIS output is limited to WGS84/Geographic/LatLng/4326 or 102100/WebMercator
* Testing through Grunt/PhantomJS doesn't work right now

### Todos
* Remove ArcGIS Javascript as a dependancy
* Make this work in Node.js