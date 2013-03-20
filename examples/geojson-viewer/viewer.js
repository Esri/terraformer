require([
  "dojo/query",
  "terraformer/arcgis",
  "esri/map"
], function ($, TerraformerArcGIS) {
  var map = new esri.Map("map", {
    basemap: "gray",
    center: [-122, 45],
    zoom: 6
  });

  function showOnMap(){
    // parse the input as json
    var input = JSON.parse($("#input").attr("value")[0]);

    // convert teh geojson object to a arcgis json representation
    var arcgis = TerraformerArcGIS.convert(input);

    var gfx;
    // if arcgis.geometry is set we have a graphic json
    // else we can create our own json and set the symbol on it.
    if(arcgis.geometry){
      gfx = new esri.Graphic(arcgis).setSymbol(new esri.symbol.SimpleFillSymbol());
    } else {
      gfx = new esri.Graphic({
        geometry: arcgis
      }).setSymbol(new esri.symbol.SimpleFillSymbol());
    }

    // add the graphic to the map
    map.graphics.add(gfx);

    // center the map on the graphic
    map.setExtent(gfx.geometry.getExtent());
  }

  $("#input").on("change", showOnMap);
  $("#submit").on("click", showOnMap);
});