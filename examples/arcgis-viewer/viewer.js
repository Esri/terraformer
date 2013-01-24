require([
  "dojo/query",
  "terraformer/terraformer",
  "terraformer/arcgis",
  "esri/map"
], function ($, Terraformer, TerraformerArcGIS) {
  var map = new esri.Map("map", {
    basemap: "gray",
    center: [-122, 45],
    zoom: 6
  });

  function showOnMap(){
    var input = JSON.parse($("#input").attr("value")[0]);
    var arcgis = TerraformerArcGIS.convert(input);
    var geometry = esri.geometry.fromJson(arcgis);
    var gfx = new esri.Graphic(geometry, new esri.symbol.SimpleFillSymbol());
    map.graphics.add(gfx);
    map.setExtent(gfx.geometry.getExtent());
  }

  $("#input").on("change", showOnMap);
  $("#submit").on("click", showOnMap);
});