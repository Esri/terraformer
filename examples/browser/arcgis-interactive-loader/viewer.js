require([
  "dojo/query",
  "esri/map",
  "esri/symbols/SimpleFillSymbol", 
  "esri/symbols/SimpleLineSymbol",
  "dojo/_base/Color"
], function (query, Map, SimpleFillSymbol, SimpleLineSymbol, Color) {

  var map = new esri.Map("map", {
    basemap: "topo",
    center: [-122, 45],
    zoom: 6
  });

  var hullOutline = new esri.symbol.SimpleLineSymbol("dash",new dojo.Color([47,140,212]), 2);
  var boundsOutline = new esri.symbol.SimpleLineSymbol("dash",new dojo.Color([212,125,47]), 2);
  var hullSymbol = new esri.symbol.SimpleFillSymbol("solid", hullOutline, new dojo.Color([195,229,255,0.5]));
  var boundsSymbol = new esri.symbol.SimpleFillSymbol("solid", boundsOutline, new dojo.Color([255,215,180,0.5]));

  var currentPrimitive;
  var shape;

  function showGeoJSON(geojson){
    // convert the geojson object to a arcgis json representation
    currentPrimitive = new Terraformer.Primitive(geojson);
    var arcgis = Terraformer.ArcGIS.convert(currentPrimitive);
    for (var i=0; i < arcgis.length; i++){
      addGraphic(arcgis[i], new Color([255,255,0,0.25]));
    }
  }

  function showWKT(wkt){
    currentPrimitive = Terraformer.WKT.parse(wkt);
    var arcgis = Terraformer.ArcGIS.convert(currentPrimitive);
    addGraphic(arcgis, new Color([255,0,255,0.25]));
  }

  function showArcGIS(arcgis){
    currentPrimitive = Terraformer.ArcGIS.parse(arcgis);
    addGraphic(arcgis, new Color([0,255,255,0.25]));
  }

  function getSymbol(color) {
    var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
    new Color([255,0,0, .5]), 2), color);
    return sfs;
  }

  function addLastPoint(geometry) {
    var pt = geometry.rings[0][0];
    geometry.rings[0].push(pt);
  }

  function addGraphic(arcgis,color){
    // if arcgis.geometry is set we have a graphic json
    // else we can create our own json and set the symbol on it.
    if(arcgis.geometry){
      addLastPoint(arcgis.geometry);
      shape = new esri.Graphic(arcgis).setSymbol(getSymbol(color));
    } else {
      addLastPoint(arcgis);
      shape = new esri.Graphic({
        geometry: arcgis
      }).setSymbol(getSymbol(color));
    }

    // add the graphic to the map
    map.graphics.add(shape);

    // center the map on the graphic
    map.setExtent(shape.geometry.getExtent().expand(1.2));
  }

  function showOnMap(){
    map.graphics.clear();

    // parse the input as json
    var input = query(".tab-pane.active textarea").attr("value")[0];
    var type = query(".tab-pane.active textarea").attr("data-type")[0];


    switch(type){
    case "wkt":
      showWKT(input);
      break;
    case "geojson":
      showGeoJSON(JSON.parse(input));
      break;
    case "arcgis":
      showArcGIS(JSON.parse(input));
      break;
    }
  }

  function showConvexOnMap(){

    // create a convex hull
    var convex = new Terraformer.Polygon([ currentPrimitive.convexHull() ]);

    // convert the geojson object to a arcgis json representation
    var arcgis = Terraformer.ArcGIS.convert(convex);

    // create a new geometry object from json
    var geometry = esri.geometry.fromJson(arcgis);

    // make a new graphic to put on the map
    var gfx = new esri.Graphic(geometry, hullSymbol);

    // add the graphic to the map
    map.graphics.add(gfx);

    shape.getDojoShape().moveToFront();

    // center the map on the graphic
    map.setExtent(gfx.geometry.getExtent());
  }

  function showBBoxOnMap(){

    var box = currentPrimitive.bbox;

    // create a bbox hull
    var bbox = new Terraformer.Polygon( [ [ [ box[0], box[1] ], [ box[0], box[3] ], [ box[2], box[3] ], [ box[2], box[1] ], [ box[0], box[1] ]  ] ] );

    // convert the geojson object to a arcgis json representation
    var arcgis = Terraformer.ArcGIS.convert(bbox);

    // create a new geometry object from json
    var geometry = esri.geometry.fromJson(arcgis);

    // make a new graphic to put on the map
    var gfx = new esri.Graphic(geometry, boundsSymbol);

    // add the graphic to the map
    map.graphics.add(gfx);

    shape.getDojoShape().moveToFront();

    // center the map on the graphic
    map.setExtent(gfx.geometry.getExtent());
  }

  query("#submit").on("click", showOnMap);
  query("#bounding").on("click", showBBoxOnMap);
  query("#convex").on("click", showConvexOnMap);
  query("#clear").on("click", function(){
    map.graphics.clear();
  });
});
