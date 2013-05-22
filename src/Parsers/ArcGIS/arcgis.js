/* globals Terraformer */


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
function flattenHoles(multipolygon){
  var output = [], polygon;
  for (var i = 0; i < multipolygon.length; i++) {
    polygon = multipolygon[i];
    for (var ii = 0; ii < polygon.length; ii++) {
      output.push(polygon[ii]);
    }
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

//used for checking for holes in arcgis rings
function convertRingsToGeoJSON(rings){
  var outputRings = [];
  var ring;
  var i;


  for (var r = 0; r < rings.length; r++) {
    ring = rings[r];
    var polygon = [ ring ];
    var contained = false;

    // skip this item if another item contains it
    for (i = 0; i < rings.length; i++) {
      var otherRing = rings[i];
      if(ring !== otherRing && coordinatesContainCoordinates(otherRing, ring)){
        contained = true;
      }
    }

    if (contained) {
      continue;
    }

    // loop over all rings and if a ring is contained by this ring add it to the polygon
    for (i = 0; i < rings.length; i++) {
      var potentialHole = rings[i];
      if(ring !== rings[i] && coordinatesContainCoordinates(ring, potentialHole)){
        polygon.push(rings[i]);
      }
    }

    outputRings.push(polygon);
  }

  return {
    type: "MultiPolygon",
    coordinates: outputRings
  };

}

// this takes an arcgis geometry and converts it to geojson
function parse(arcgis){
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

  if(arcgis.attributes && arcgis.geometry) {
    geojson.type = "Feature";
    geojson.geometry = parse(arcgis.geometry);
    geojson.properties = arcgis.attributes;
  }

  var inputSpatialReference = (arcgis.geometry) ? arcgis.geometry.spatialReference : arcgis.spatialReference;

  //convert spatial ref if needed
  if(inputSpatialReference && inputSpatialReference.wkid === 102100){
    geojson = Terraformer.toGeographic(geojson);
  }

  return new Terraformer.Primitive(geojson);
}

// this takes a point line or polygon geojson object and converts it to the appropriate
function convert(geojson, sr){
  var spatialReference = (sr) ? sr : { wkid: 4326 };
  var result = {}, i;

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
    result.rings = geojson.coordinates;
    result.spatialReference = spatialReference;
    break;
  case "MultiPolygon":
    result.rings = flattenHoles(geojson.coordinates);
    result.spatialReference = spatialReference;
    break;
  case "Feature":
    result.geometry = convert(geojson.geometry);
    result.attributes = geojson.properties;
    break;
  case "FeatureCollection":
    result = [];
    for (i = 0; i < geojson.features.length; i++){
      result.push(convert(geojson.features[i]));
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