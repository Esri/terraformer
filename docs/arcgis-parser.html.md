---
title: ArcGIS Parser
layout: documentation
---
# ArcGIS JSON Parser

<!-- table_of_contents -->

This plugin handles two-way conversion between [GeoJSON](http://geojson.org/geojson-spec.html) and the [ArcGIS Geometry](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Geometry_objects/02r3000000n1000000/) format used by Esri.

## Using the ArcGIS JSON Parser

The ArcGIS parser can be used client-side in a browser and server-side via Node.js.

```js
// parse an ArcGIS Geometry to GeoJSON
var geojsonPoint = Terraformer.ArcGIS.parse({
  "x":-122.6764,
  "y":45.5165,
  "spatialReference": {
    "wkid": 4326
  }
});

// convert a GeoJSON object into an ArcGIS geometry
var arcgisPoint = Terraformer.ArcGIS.convert({
  "type": "Point",
  "coordinates": [45.5165, -122.6764]
});
```

### Using in the Browser

In the browser, the core [Terraformer](http://github.com/esri/terraformer) library is required.

```html
<script src="terraformer.min.js"></script>
<script src="terraformer-arcgis-parser.min.js"></script>
<script>
  // Terraformer and Terraformer.ArcGIS will be defined.
</script>
```

You can also use [Bower](http://bower.io/) to install the components if you like, or download them and host them yourself.

```
$ bower install terraformer-arcgis-parser
```

### Using in Node.js

Just install the package from npm with `$ npm install terraformer-arcgis-parser` Then include it in your application.

```js
Terraformer.ArcGIS = require('terraformer-arcgis-parser');

// Start parsing and converting!
```

### Methods

#### ArcGIS.parse(json, options)

`Terraformer.ArcGIS.parse(json, options)` - Converts from ArcGIS JSON to GeoJSON or a [Terraformer.Primitive](http://terraformer.io/core/#terraformerprimitive).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `idAttribute` | `String` | `"OBJECTID"` |  By default, when converting GeoJSON Features the `id` key of your output feature will be set on the `OBJECTID` field. This option allows you to assign your ID using a different fieldname. |

##### Notes

Terraformer will also handle converting `FeatureCollection` and `GeometryCollection` objects to arrays of ArcGIS geometries or features. However it will **not** do this in reverse. This is because there is no official structure for arrays of features and geometries in ArcGIS and output features will be missing an `id` property. See [this issue](https://github.com/Esri/Terraformer/issues/104) for more details.

##### Example

```js
// parse an ArcGIS Geometry to GeoJSON
var point = Terraformer.ArcGIS.parse({
  "x":-122.6764,
  "y":45.5165,
  "spatialReference": {
    "wkid": 4326
  }
});
```

#### ArcGIS.convert(geojson, options)
`Terraformer.ArcGIS.convert(geoJSON, options)` will convert GeoJSON or a Terraformer Primitive to ArcGIS JSON.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `sr` | `Number` | `4326` | This is used to set the value of `spatialReference.wkid` in the output. Setting `sr` **does not** convert the `geojson` coordinates, it only identifies the projection using the appropriate code. |
| `idAttribute` | `String` | `"OBJECTID" "FID"` | When converting ArcGIS Feature the `attributes` will contain the ID of the feature. This is usually called `OBJECTID` or `FID`. If your feature does not use the `OBJECTID` or `FID` keys as its ID, you should define what the key representing your Features ID is.

##### Notes

If the geometry is in the Web Mercator spatial reference it **will be reprojected** to WGS84.

##### Example

```js
// take a Terraformer.Primitive or GeoJSON and convert it to an ArcGIS JSON object
var point = ArcGIS.convert({
  "type": "Point",
  "coordinates": [45.5165, -122.6764]
});
```
