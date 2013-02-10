# ArcGIS Parser

ArcGIS has its own Geographic format which is detailed [here](http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/geometry.html).

This format predates GeoJSON and has a number of unique advantages especially for handing holes in polygons.

Terraformer provides support for converting this format to and from GeoJSON.

# Using in Node

Require the terraformer ArcGIS module.

    var TerraformerArcGIS = require("terraformer-arcgis");

# Using with AMD Loaders

Require the terraformer ArcGIS module. *Note: for this to work you will have to configure your loader to point to the Terraformer modules*

    require([
      "terraformer/arcgis"
    ], function(TerraformerArcGIS){
      // Convert Stuff!
    });

# Basic Browser Usage

Just add a script tag pointing to the ArcGIS parser.

    <script src="https://raw.github.com/geoloqi/Terraformer/master/dist/browser/arcgis.js">

The parser will be availabe in the `Terraformer.ArcGIS` namespace.

# ArcGIS to GeoJSON

Use the `parse` method to convert ArcGIS to GeoJSON. You can pass any of the JSON objects from [spec](http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/geometry.html) or [Graphics](http://help.arcgis.com/en/webapi/javascript/arcgis/jsapi/#graphic) or [Geometries](http://help.arcgis.com/en/webapi/javascript/arcgis/jsapi/#geometry) from the [ArcGIS Javascript API](http://help.arcgis.com/en/webapi/javascript/arcgis/)

This will return an instance of `Terraformer.Primitive`

    var arcgis = {
      "x" : -118.15,
      "y" : 33.80,
      "spatialReference" : {
        "wkid" : 4326
      }
    };

    var geojson = Terraformer.ArcGIS.parse(arcgis);

# GeoJSON to ArcGIS

To convert Terraformer objects or just GeoJSON use the `convert` method. This will return the ArcGIS JSON representation of the object.

    var point = new Terraformer.Point(-122.6764, 45.5165);

    var arcgis = Terraformer.ArcGIS.convert(point);