/*globals counties*/

require([
  "dojo/query",
  "terraformer/terraformer",
  "terraformer/arcgis",
  "terraformer/geostore",
  "terraformer/rtree",
  "terraformer/Store/Memory",
  "esri/map"
], function (query, Terraformer, ArcGIS, GeoStore, RTree, MemoryStore) {

  var map = new esri.Map("map", {
    basemap: "gray",
    center: [-98, 38],
    zoom: 4
  });

  // create a GeoStore
  var CountyGeoStore= new GeoStore.GeoStore({
    store: new MemoryStore.Memory(),
    index: new RTree.RTree()
  });

  // wait for the load event
  map.on('load', function () {
    // loop over counties
    for (var i = counties.length - 1; i >= 0; i--) {
      var county = counties[i];

      // insert into the index
      CountyGeoStore.add(county);

      // convert for display to an arcgis object
      var arcgis = ArcGIS.convert(county);

      // convert to an esri geometry
      var geometry = esri.geometry.fromJson(arcgis.geometry);

      // make a new graphic for the map
      var gfx = new esri.Graphic(geometry, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color([100,155,55]),1), new dojo.Color([155,255,100,0.35])));

      // add the graphic to the map
      map.graphics.add(gfx);
    }
  });

  function findMe() {
    // One-shot position request.
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      CountyGeoStore.contains({
        type: "Point",
        coordinates: [ -122.61923540493, 45.533841334631 ]
      }).then(function(results){
        if (results.length) {
          query("#whereami")[0].innerHTML = "According to your browser, you are at " + lng + " longitude, " + lat + " latitude, and are in " + results[0].properties.name + " county";

          // add highlighted county graphic to map, center and zoom
          var arcgis = ArcGIS.convert(results[0]);
          var geometry = esri.geometry.fromJson(arcgis.geometry);

          var gfx = new esri.Graphic(geometry, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new dojo.Color([255,155,55]),2), new dojo.Color([255,155,100,0.45])));

          map.graphics.add(gfx);
          map.setExtent(geometry.getExtent(), true);
        } else {
          query("#whereami")[0].innerHTML = "We couldn't find where you were. Or you aren't in a country right now.";
        }
      });
    });
  }

  query("#submit").on("click", findMe);
});