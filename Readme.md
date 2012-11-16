# Terraformer

#### Key Features

### Configuration

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

### Notes
* This requires that the ESRI ArcGIS library be loaded BEFORE terraformer.js
* The full GeoJSON spec is not supported as there is no ArcGIS equivilant to `GeometryCollection` or `FeatureCollection`
* Geojson input/output is assumed to be in WGS84 (Also called Geographic, LatLng, or 4326)
* ArcGIS output is limited to WGS84/Geographic/LatLng/4326 or 102100/WebMercator
* You must wait until the DOM is loaded to convert GeoJSON into ArcGIS