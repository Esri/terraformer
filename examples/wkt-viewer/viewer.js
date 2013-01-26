require([
  "dojo/query",
  "terraformer/arcgis",
  "terraformer/wkt",
  "esri/map"
], function ($, TerraformerArcGIS, TerraformerWKT) {
  var map = new esri.Map("map", {
    basemap: "gray",
    center: [-122, 45],
    zoom: 6
  });

  function showOnMap(){
    // parse the input as json
    var input = $("#input").attr("value")[0];

    // convert the wkt to internal representation
    var primitive = TerraformerWKT.parse(input);

    // convert the geojson object to a arcgis json representation
    var arcgis = TerraformerArcGIS.convert(primitive);

    // create a new geometry object from json
    var geometry = esri.geometry.fromJson(arcgis);

    // make a new graphic to put on the map
    var gfx = new esri.Graphic(geometry, new esri.symbol.SimpleFillSymbol());

    // add the graphic to the map
    map.graphics.add(gfx);

    // center the map on the graphic
    map.setExtent(gfx.geometry.getExtent());
  }

  $("#input").on("change", showOnMap);
  $("#submit").on("click", showOnMap);
});