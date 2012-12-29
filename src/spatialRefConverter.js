var EarthRadius = 6378137, // in meters
    DegreesPerRadian = 57.295779513082320,
    RadiansPerDegree =  0.017453292519943;

var MercatorCRS = {
  "type": "link",
  "properties": {
    "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
    "type": "ogcwkt"
  }
}

var GeographicCRS = {
  "type": "link",
  "properties": {
    "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
    "type": "ogcwkt"
  }
}

function radToDeg(rad) {
  return rad * DegreesPerRadian;
}

function degToRad(deg) {
  return deg * RadiansPerDegree;
}

function iterateCoordinates(coordinates, func) {
  for (var i = 0; i < coordinates.length; i++) {
    // we found a number so lets convert this pair
    if(typeof coordinates[i][0] === "number"){
      coordinates[i] = func(coordinates[i]);
    }
    // we found an coordinates array it again and run THIS function against it
    if(typeof coordinates[i] === "object"){
      coordinates[i] = iterateCoordinates(coordinates[i], func);
    }
  };
  return coordinates;
}

// Convert a GeoJSON Position object to mercator
function positionToMercator(position) {
  var lng = position[0];
  var lat = position[1];
  
  if (lat > 89.99999) {
    lat = 89.99999;
  } else if (lat < -89.99999) {
    lat = -89.99999;
  }
  
  var lat_rad = degToRad(lat);
  return [degToRad(lng) * EarthRadius, EarthRadius/2.0 * Math.log( (1.0 + Math.sin(lat_rad)) / (1.0 - Math.sin(lat_rad)) )];
}

// Convert a GeoJSON Point object to mercator
function pointToMercator(geojson){
  geojson.crs = MercatorCRS;
  geojson.coordinates = positionToMercator(geojson.coordinates);
  return geojson;
}

function multiPointToMercator(geojson){
  geojson.crs = MercatorCRS;
  geojson.coordinates = iterateCoordinates(geojson.coordinates, positionToMercator);
  return geojson;
}


function lineStringToMercator(geojson){
  geojson.crs = MercatorCRS;
  geojson.coordinates = iterateCoordinates(geojson.coordinates, positionToMercator);
  return geojson;
}

function multiLineStringToMercator(geojson){
  geojson.crs = MercatorCRS;
  geojson.coordinates = iterateCoordinates(geojson.coordinates, positionToMercator);
  return geojson;
}


function multiPolygonToMercator(geojson){}


function polygonToMercator(geojson){}

function geometryCollectionToMercator(geojson){}
function featureCollectionToMercator(geojson){}
function featureToMercator(geojson){}


function positionToLatLng(position) {
  var x = position[0];
  var y = position[1];
  var lng_deg = radToDeg(x / EarthRadius);
  return [lng_deg - (Math.floor((lng_deg + 180) / 360) * 360), radToDeg((Math.PI / 2) - (2 * Math.atan(Math.exp(-1.0 * y / EarthRadius))))];
}

function pointToLatLng(geojson){}
function geometryCollectionToLatLng(geojson){}
function multiPolygonToLatLng(geojson){}
function multiLineStringToLatLng(geojson){}
function multiPointToLatLng(geojson){}
function polygonToLatLng(geojson){}
function lineStringToLatLng(geojson){}
function featureCollectionToLatLng(geojson){}
function featureToLatLng(geojson){}

function toMercator(geojson) {
  switch(geojson.type){
  case "Point":
    break;
  case "GeometryCollection":
    break;
  case "MultiPolygon":
    break;
  case "MultiLineString":
    break;
  case "MultiPoint":
    break;
  case "Polygon":
    break;
  case "LineString":
    break;
  case "FeatureCollection":
    break;
  case "Feature":
    break;
  default:
    break;
  }
}

function toLatLng(geojson) {
  switch(geojson.type){
  case "Point":
    break;
  case "GeometryCollection":
    break;
  case "MultiPolygon":
    break;
  case "MultiLineString":
    break;
  case "MultiPoint":
    break;
  case "Polygon":
    break;
  case "LineString":
    break;
  case "FeatureCollection":
    break;
  case "Feature":
    break;
  default:
    break;
  }
}

