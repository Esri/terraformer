/* globals Terraformer */
(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(["terraformer/terraformer"],factory);
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (typeof root.Terraformer === "undefined"){
      root.Terraformer = {};
    }
    root.Terraformer.ArcGIS = factory();
  }

}(this, function() {
  var exports = {};
  var Terraformer;

  // Local Reference To Browser Global
  if(typeof this.navigator === "object") {
    Terraformer = this.Terraformer;
  }

  // Setup Node Dependencies
  if(typeof module === 'object' && typeof module.exports === 'object') {
    Terraformer = require('terraformer');
  }

  // Setup AMD Dependencies
  if(arguments[0] && typeof define === 'function' && define.amd) {
    Terraformer = arguments[0];
  }

  // determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
  // or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
  // points-are-in-clockwise-order
  function ringIsClockwise(ringToTest) {
    var total = 0,i = 0;
    var rLength = ringToTest.length;
    var pt1 = ringToTest[i];
    var pt2;
    for (i; i < rLength - 1; i++) {
      pt2 = ringToTest[i + 1];
      total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
      pt1 = pt2;
    }
    return (total >= 0);
  }

  // This function flattens holes in polygons to one array of rings
  //
  // [
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  // ]
  // becomes
  // [
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  // ]
  function flattenPolygonRings(polygon){
    var output = [];
    var outerRing = polygon.shift();

    if(!ringIsClockwise(outerRing)){
      outerRing.reverse();
    }

    output.push(outerRing);

    for (var i = 0; i < polygon.length; i++) {
      var hole = polygon[i];
      if(ringIsClockwise(hole)){
        outerRing.reverse();
      }
      output.push(polygon[i]);
    }

    return output;
  }

  // This function flattens holes in multipolygons to one array of polygons
  // so
  // [
  //   [
  //     [ array of outer coordinates ]
  //     [ hole coordinates ]
  //     [ hole coordinates ]
  //   ],
  //   [
  //     [ array of outer coordinates ]
  //     [ hole coordinates ]
  //     [ hole coordinates ]
  //   ],
  // ]
  // becomes
  // [
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  // ]
  function flattenMultiPolygonRings(rings){
    var output = [];
    for (var i = 0; i < rings.length; i++) {
      var polygon = flattenPolygonRings(rings[i]);
      for (var x = polygon.length - 1; x >= 0; x--) {
        var ring = polygon[x];
        output.push(ring);
      }
      output.push();
    }
    return output;
  }

  function coordinatesContainCoordinates(outer, inner){
    var intersects = Terraformer.Tools.arrayIntersectsArray(outer, inner);
    var contains = Terraformer.Tools.coordinatesContainPoint(outer, inner[0]);
    if(!intersects && contains){
      return true;
    }
    return false;
  }

  // do any polygons in this array contain any other polygons in this array?
  // used for checking for holes in arcgis rings
  function convertRingsToGeoJSON(rings){
    var outerRings = [];
    var holes = [];

    // for each ring
    for (var r = 0; r < rings.length; r++) {
      var ring = rings[r];

      // is this ring an outer ring? is it clockwise?
      if(ringIsClockwise(ring)){
        var polygon = [ ring ];
        outerRings.push(polygon); // push to outer rings
      } else {
        holes.push(ring); // counterclockwise push to holes
      }
    }

    // while there are holes left...
    while(holes.length){
      // pop a hole off out stack
      var hole = holes.pop();
      var matched = false;

      // loop over all outer rings and see if they contain our hole.
      for (var x = outerRings.length - 1; x >= 0; x--) {
        var outerRing = outerRings[x][0];
        if(coordinatesContainCoordinates(outerRing, hole)){
          // the hole is contained push it into our polygon
          outerRings[x].push(hole);

          // we matched the hole
          matched = true;

          // stop checking to see if other outer rings contian this hole
          break;
        }
      }

      // no outer rings contain this hole turn it into and outer ring (reverse it)
      if(!matched){
        outerRings.push([ hole.reverse() ]);
      }
    }

    if(outerRings.length === 1){
      return {
        type: "Polygon",
        coordinates: outerRings[0]
      };
    } else {
      return {
        type: "MultiPolygon",
        coordinates: outerRings
      };
    }
  }

  // ArcGIS -> GeoJSON
  function parse(input){
    var arcgis = JSON.parse(JSON.stringify(input));
    var geojson = {};

    if(arcgis.x && arcgis.y){
      geojson.type = "Point";
      geojson.coordinates = [arcgis.x, arcgis.y];
    }

    if(arcgis.points){
      geojson.type = "MultiPoint";
      geojson.coordinates = arcgis.points;
    }

    if(arcgis.paths) {
      if(arcgis.paths.length === 1){
        geojson.type = "LineString";
        geojson.coordinates = arcgis.paths[0];
      } else {
        geojson.type = "MultiLineString";
        geojson.coordinates = arcgis.paths;
      }
    }

    if(arcgis.rings) {
      geojson = convertRingsToGeoJSON(arcgis.rings);
    }

    if(arcgis.geometry) {
      geojson.type = "Feature";
      geojson.geometry = parse(arcgis.geometry);
      geojson.properties = arcgis.attributes || {};
    }

    var inputSpatialReference = (arcgis.geometry) ? arcgis.geometry.spatialReference : arcgis.spatialReference;

    //convert spatial ref if needed
    if(inputSpatialReference && inputSpatialReference.wkid === 102100){
      geojson = Terraformer.toGeographic(geojson);
    }

    return new Terraformer.Primitive(geojson);
  }
  
  // GeoJSON -> ArcGIS
  function convert(input, arcgisIdField){
    var geojson = JSON.parse(JSON.stringify(input));
    var spatialReference = { wkid: 4326 };
    var result = {};
    var i;

    switch(geojson.type){
    case "Point":
      result.x = geojson.coordinates[0];
      result.y = geojson.coordinates[1];
      result.spatialReference = spatialReference;
      break;
    case "MultiPoint":
      result.points = geojson.coordinates;
      result.spatialReference = spatialReference;
      break;
    case "LineString":
      result.paths = [geojson.coordinates];
      result.spatialReference = spatialReference;
      break;
    case "MultiLineString":
      result.paths = geojson.coordinates;
      result.spatialReference = spatialReference;
      break;
    case "Polygon":
      result.rings = flattenPolygonRings(geojson.coordinates);
      result.spatialReference = spatialReference;
      break;
    case "MultiPolygon":
      result.rings = flattenMultiPolygonRings(geojson.coordinates);
      result.spatialReference = spatialReference;
      break;
    case "Feature":
      result.geometry = convert(geojson.geometry);
      result.attributes = geojson.properties;
      if (geojson.hasOwnProperty("id")) {
	    if (typeof arcgisIdField === "undefined" || 
	    	arcgisIdField===null) { 
	    	arcgisIdField = "geojsonid";
	    }
      	result[arcgisIdField] = geojson.id;
      }
      break;
    case "FeatureCollection":
      result = [];
      for (i = 0; i < geojson.features.length; i++){
        result.push(convert(geojson.features[i], arcgisIdField));
      }
      break;
    case "GeometryCollection":
      result = [];
      for (i = 0; i < geojson.geometries.length; i++){
        result.push(convert(geojson.geometries[i]));
      }
      break;
    }

    return result;
  }

  exports.parse   = parse;
  exports.convert = convert;

  return exports;
}));
