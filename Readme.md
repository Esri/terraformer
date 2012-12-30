# Terraformer

#### Key Features

* Cient-side conversion to and from ArcGIS Geometries to GeoJSON
* Supports both geographic and web mercator

### Converting

```
// Basic
Terraformer.toArcGIS(geoJSON);

// With Options
Terraformer.toArcGIS(geoJSON);
```

```
// Basic
Terraformer.toGeoJSON(arcgisGeometry);

// Basic
Terraformer.toArcGIS(arcgisGeometry);
```

### Tests
Just open the `SpecRunner.html` file in the `spec` folder and open it in your web browser. Support for running tests with Grunt/PhantomJS is coming soon.

### Notes
* 

### Todos
* Make this work in Node.js
* Convert Feature Collections and Geometry Collections to arrys of ArcGIS geometries