require([
  "dojo/query",
  "terraformer/arcgis",
  "terraformer/rtree",
  "esri/map"
], function ($, TerraformerArcGIS, RTree) {
  var map = new esri.Map("map", {
    basemap: "gray",
    center: [-98, 38],
    zoom: 4
  });

  // create an RTree
  var tree = new RTree.RTree();

  // wait for the load event
  map.on('load', function () {
    for (var i = 0; i < counties.features.length; i++) {
      // create a new geometry object
      var county = counties.features[i];

      // insert into the index
      tree.insert(county, { id: i });

      // convert for display to an arcgis object
      var arcgis = TerraformerArcGIS.convert(county);

      // convert to an esri geometry
      var geometry = esri.geometry.fromJson(arcgis.geometry);

      // make a new graphic for the map
      var gfx = new esri.Graphic(geometry, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color([100,155,55]),1), new dojo.Color([155,255,100,0.35])));

      map.graphics.add(gfx);
    }
  });

  function findMe() {
    // One-shot position request.
    navigator.geolocation.getCurrentPosition(function (position) {
      if (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        tree.search({ x: lng, y: lat, w: 0, h: 0}).then(function(results){
          var found = false;
          if (results !== undefined && results.length >= 0) {
            for (var i = 0; i < results.length; i++) {
              var coordinates = counties.features[results[0].id].geometry.coordinates;
              if (Terraformer.Tools.coordinatesContainPoint(coordinates[0], [ lng, lat ])) {
                $("#whereami")[0].innerHTML = "According to your browser, you are at " + lng + " longitude, " + lat + " latitude, and are in " + counties.features[results[i].id].properties.name + " county";

                // add highlighted county graphic to map, center and zoom
                var arcgis = TerraformerArcGIS.convert(counties.features[results[0].id]);
                var geometry = esri.geometry.fromJson(arcgis.geometry);

                var gfx = new esri.Graphic(geometry, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                  new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                  new dojo.Color([255,155,55]),2), new dojo.Color([255,155,100,0.45])));

                map.graphics.add(gfx);
                map.setExtent(geometry.getExtent(), true);

                found = true;
                break;
              }
            }
          }
          if (!found) {
            $("#whereami")[0].innerHTML = "Unable to find which county you are in.  Are you sure you are in the United States?";
          }
        });
      }
    });
  }

  $("#submit").on("click", findMe);
});