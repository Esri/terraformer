#### Run it with the ENUMS
`Terraformer.convert(thing).from(Terraformer.Formats.ARCGIS).to(Terraformer.Formats.GEOJSON)`

#### Run it with text in place of enums
`Terraformer.convert(thing).from("ARCGIS").to("GEOJSON");`

#### Run it async (web workers)
`Terraformer.async.convert(thing).from("arcgis").to("geojson");`

#### Automatic detection of input
`Terraformer.async.convert(thing).to("GEOJSON");`

#### As an Instance of Terraformer.Converter
```
terraformer = Terraformer.Converter({
  from: "ARCGIS",
  to: "GEOJSON"
});

geojson = terraformer.convert(shape);
```

### Convert Between

Support points, lines and polygons

* GeoJSON
* Google Maps
* Leaflet
* ArcGIS JSON

### Roadmap

Support for more formats (shapefiles, openlayers) and shape types (multipolyline, multipolygon, multipoint circles) coming soon