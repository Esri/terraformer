---
title: ArcGIS Parser
layout: documentation
---
# ArcGIS JSON Parser

<!-- table_of_contents -->

This plugin handles 2-way conversion between [GeoJSON](http://geojson.org/geojson-spec.html) and the [ArcGIS Geometry](http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/geometry.html) format used by Esri.

## Using the ArcGIS JSON Parser

The ArcGIS parser can be used client-side in a browser and server-side via Node.js.

```js
//parse an ArcGIS Geometry to GeoJSON
var geojsonPoint = Terraformer.ArcGIS.parse({
  "x":-122.6764,
  "y":45.5165,
  "spatialReference": {
    "wkid": 4326
  }
});

// convert a GeoJSON object into an ArcGIS geometry
var arcgisPoint = Terraformer.ArcGIS.convert(point)
```

### Using in the Browser

In the browser, the core [Terraformer](http://github.com/esri/terraformer) library is required.

```html
<script src="terraformer.min.js"></script>
<script src="terraformer-arcgis-parser.min.js"></script>
<script>
  //Terraformer and Terraformer.ArcGIS will be defined.
</script>
```

You can also use [Bower](http://bower.io/) to install the components if you like, or download them and host them yourself.

```
$ bower install terraformer-arcgis-parser
```

### Using in Node.js

Just install the package from NPM with `$ npm install terraformer-arcgis-parser` Then include it in your application.

```js
Terraformer.ArcGIS = require('terraformer-arcgis-parser');

// Start using the parse and convert methods!
```

### Methods

#### ArcGIS.parse(json, options)

`Terraformer.ArcGIS.parse(json, options)` - Converts from ArcGIS JSON to GeoJSON or a [Terraformer.Primitive](http://terraformer.io/core/#terraformerprimitive).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `sr` | `Number` | `4326` | This is used to set the value of `spatialReference.wkid` on the output. By default this will use 4326. Setting `sr` **will not** convert the `geojson` to that spatial reference it is only used to set the value of `spatialReference.wkid`. |
| `idAttribute` | `String` | `"OBJECTID"` |  When converting GeoJSON Features the `id` key of your feature will be set on the `OBJECTID` field in your output. If you want to assign your ID to a different key you should set this to the string of the key your wish to assign the `id` to. |

##### Notes

Terraformer will also handle converting `FeatureCollection` and `GeometryCollection` objects to arrays of ArcGIS geometries or features. However it will **not** do this in reverse as there is no official structure for arrays of features and geometries in ArcGIS and all the output features will not have `id` properties. See [this issue](https://github.com/Esri/Terraformer/issues/104) for more details.

##### Example

```js
//parse an ArcGIS Geometry to GeoJSON
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
| `idAttribute` | `String` | `"OBJECTID" "FID"` | When converting ArcGIS Feature the `attributes` will contain the ID of the feature. This is usually called `OBJECTID` or `FID`. If your feature does not use the `OBJECTID` or `FID` keys as its ID, you should define what the key representing your Features ID is.

##### Notes

If the object is in the Web Mercator spatial reference it will be converted to WGS84.

##### Example

```js
// take a Terraformer.Primitive or GeoJSON and convert it to ArcGIS JSON object
var point = ArcGIS.convert({
  "type": "Point",
  "coordinates": [45.5165, -122.6764]
});
```
