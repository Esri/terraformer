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
    var jsonObject = JSON.parse($("#input").attr("value")[0]);
    var fullextent,
      extent,
      gfx;

    // convert the geojson object to a arcgis json representation
    var arcgis = TerraformerArcGIS.convert(jsonObject);

    //if arcgis is an array loop through
    if (Array.isArray(arcgis)){
      for (var i = 0; i < arcgis.length; i++){
        gfx = makeGraphic(arcgis[i]);
        map.graphics.add(gfx);
        if (gfx.geometry.type !== "point"){
          extent = gfx.geometry.getExtent();
        } else{
          extent = new esri.geometry.Extent(gfx.geometry.x - .5, gfx.geometry.y - .5, gfx.geometry.x + .5, gfx.geometry.y + .5)
        }
        fullextent = (fullextent !== undefined) ? fullextent.union(extent) : extent;
      }
    } else{
      gfx = makeGraphic(arcgis);
      map.graphics.add(gfx);
      if (gfx.geometry.type !== "point"){
        fullextent = gfx.geometry.getExtent();
      } else{
        fullextent = new esri.geometry.Extent(gfx.geometry.x - .5, gfx.geometry.y - .5, gfx.geometry.x + .5, gfx.geometry.y + .5)
      }
    }

    // center the map on the graphic
    map.setExtent(fullextent);
  }

  function makeGraphic(arcgis){
    var gfx;
    // if arcgis.geometry is set we have a graphic json
    // else we can create our own json and set the symbol on it.
    if(arcgis.geometry){
      gfx = new esri.Graphic(arcgis);
    } else {
      gfx = new esri.Graphic({
        geometry: arcgis
      });
    }
    //set appropriate symbol for type of geometry
    gfx.setSymbol(getSymbolForGraphic(gfx.geometry));
    return gfx;
  }

  function getSymbolForGraphic(geometry){
    var symbol;
    if (! geometry){
      return symbol;
    }

    switch(geometry.type) {
      case "point":
        symbol = new esri.symbol.SimpleMarkerSymbol();
        break;
      case "multipoint":
        symbol = new esri.symbol.SimpleMarkerSymbol();
        break;
      case "polyline":
        symbol = new esri.symbol.SimpleLineSymbol();
        break;
      case "polygon":
        symbol = new esri.symbol.SimpleFillSymbol();
        break;
    }
    return symbol;
  }

  $("#input").on("change", showOnMap);
  $("#submit").on("click", showOnMap);
});