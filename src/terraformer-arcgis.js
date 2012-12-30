(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // define and anonymous AMD module
    define(factory);
  } else {
    // define a browser global
    root.Terraformer = factory();
  }

  // if we are testing we want a global
  if(typeof jasmine === 'object') {
    root.Terraformer = factory();
  }
}(this, function(){
  var Terraformer = {},
      EarthRadius = 6378137,
      DegreesPerRadian = 57.295779513082320,
      RadiansPerDegree =  0.017453292519943,
      MercatorCRS = {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      },
      GeographicCRS = {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
          "type": "ogcwkt"
        }
      };

  function radToDeg(rad) {
    return rad * DegreesPerRadian;
  }

  function degToRad(deg) {
    return deg * RadiansPerDegree;
  }

  function eachGeometry(geojson, func){
    for (var i = 0; i < geojson.geometries.length; i++) {
      geojson.geometries[i].geometry = eachPosition(geojson.features[i].geometry, func);
    };
    return geojson;
  }

  function eachFeature(geojson, func){
    for (var i = 0; i < geojson.features.length; i++) {
      geojson.features[i].geometry = eachPosition(geojson.features[i].geometry, func);
    };
    return geojson;
  }

  function eachPosition(coordinates, func) {
    for (var i = 0; i < coordinates.length; i++) {
      // we found a number so lets convert this pair
      if(typeof coordinates[i][0] === "number"){
        coordinates[i] = func(coordinates[i]);
      }
      // we found an coordinates array it again and run THIS function against it
      if(typeof coordinates[i] === "object"){
        coordinates[i] = eachPosition(coordinates[i], func);
      }
    };
    return coordinates;
  }

  // Convert a GeoJSON Position object to Geographic (4326)
  function positionToGeographic(position) {
    var x = position[0];
    var y = position[1];
    return [radToDeg(x / EarthRadius) - (Math.floor((radToDeg(x / EarthRadius) + 180) / 360) * 360), radToDeg((Math.PI / 2) - (2 * Math.atan(Math.exp(-1.0 * y / EarthRadius))))];
  }

  // Convert a GeoJSON Position object to Web Mercator (102100)
  function positionToMercator(position) {
    var lng = position[0];
      var lat = Math.max(Math.min(position[1], 89.99999), -89.99999);
      
      return [degToRad(lng) * EarthRadius, EarthRadius/2.0 * Math.log( (1.0 + Math.sin(degToRad(lat))) / (1.0 - Math.sin(degToRad(lat))) )];
  }

  // This function flattens holes in multipolygons to one array of polygons
  function flattenHoles(array){
    var output = [];
    for (var i = 0; i < array.length; i++) {
      polygon = array[i];
      if(polygon.length > 1){
        for (var ii = 0; ii < polygon.length; ii++) {
          output.push(polygon[ii]);
        };
      } else {
        output.push(polygon[0]);
      }
      
    };
    return output;
  };
        
  function findGeometryType(input){
    if(input.coordinates && input.type){
      if(input.type === "Point"){
        return "Point";
      }
      if(input.type === "LineString"){
        return "LineString";
      }
      if(input.type === "Polygon"){
        return "Polygon";
      }
      if(input.type === "MultiPoint"){
        return "MultiPoint";
      }
      if(input.type === "MultiLineString"){
        return "MultiLineString";
      }
      if(input.type === "MultiPolygon"){
        return "MultiPolygon";
      }
      if(input.type === "Feature"){
        return "Feature";
      }
      throw "Terraformer: invalid GeoJSON object. Are you sure your data is properly formatted?";
    }

    if(input.spatialReference){
      if(input.x && input.y){
        return "Point";
      }
      if(input.points){
        return "MultiPoint";
      }
      if(input.paths) {
        return (input.paths.length === 1) ? "LineString" : "MultiLineString";
      }
      if(input.rings) {
        return (input.rings.length === 1) ? "Polygon" : "MultiPolygon";
      }
      throw "Terraformer: invalid ArcGIS input. Are you sure your data is properly formatted?";
    }
    throw "Terraformer: data is not a valid ArcGIS or GeoJSON object";
  };

  function convert(geojson, converter){
    if(geojson.type === "Point") {
      geojson.coordinates = converter(geojson.coordinates);
    } else if(geojson.type === "Feature") {
      geojson.geometry = convert(geojson, converter);
    } else if(geojson.type === "FeatureCollection") {
      geojson.features = eachFeature(geojson, converter);
    } else if(geojson.type === "GeometryCollection") {
      geojson.geometries = eachGeometry(geojson, converter);
    } else {
      geojson.coordinates = eachPosition(geojson.coordinates, converter);
    }
    
    if(converter === positionToMercator){
      geojson.crs = MercatorCRS;
    }

    if(converter === positionToGeographic){
      geojson.crs = GeographicCRS;
    }

    return geojson;
  }

  Terraformer.toMercator = function(geojson) {
    return convert(geojson, positionToMercator);
  }

  Terraformer.toGeographic = function(geojson) {
    return convert(geojson, positionToGeographic);
  }

  // this takes an arcgis geometry and converts it to geojson
  Terraformer.toGeoJSON = function(arcgis){
    var type = findGeometryType(arcgis);
    var result = {
      type: type
    };

    switch(type){
    case "Point":
      result.coordinates = [arcgis.x, arcgis.y];
      break;
    case "MultiPoint":
      result.coordinates = arcgis.points;
      break;
    case "LineString":
      result.coordinates = arcgis.paths[0];
      break;
    case "MultiLineString":
      result.coordinates = arcgis.paths;
      break;
    case "Polygon":
      result.coordinates = arcgis.rings;
      break;
    case "MultiPolygon":
      result.coordinates = arcgis.rings;
      break;
    }
    
    if(arcgis.spatialReference.wkid === 102100) {
      result.crs = MercatorCRS;
    }

    return result;
  };

  // this takes a point line or polygon geojson object and converts it to the appropriate
  Terraformer.toArcGIS = function(geojson, spatialReference){
    var type = findGeometryType(geojson);
    var result = {
      spatialReference: spatialReference || { wkid: 4326 }
    };

    // if this is a feautre pull out its geometry and recalculate its type
    if(type === "Feature"){
      geojson = geojson.geometry;
      type = findGeometryType(geojson);
    }

    switch(type){
    case "Point":
      result.x = geojson.coordinates[0];
      result.y = geojson.coordinates[1];
      break;
    case "MultiPoint":
      result.points = geojson.coordinates;
      break;
    case "LineString":
      result.paths = [geojson.coordinates];
      break;
    case "MultiLineString":
      result.paths = geojson.coordinates;
      break;
    case "Polygon":
      result.rings = geojson.coordinates;
      break;
    case "MultiPolygon":
      result.rings = flattenHoles(geojson.coordinates);
      break;
    }

    return result;
  };

  return Terraformer;
}));