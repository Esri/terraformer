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
  var Terraformer = {};

  Terraformer.config = {
    stringifyGeoJSON: false,
    returnFeatures: false,
    outputSpatialReference: {
      wkid: 102100
    }
  };

  // This function flattens holes in multipolygons to one array of polygons
  var flattenHoles = function(array){
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
        
  var findGeometryType = function(input){

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

  // this takes an arcgis geometry and converts it to geojson
  Terraformer.toGeoJSON = function(arcgis, opts){
    var options = (typeof opts === "undefined") ? {} : opts;
    var type = findGeometryType(arcgis);
    var returnString = (options.stringify) ? options.stringify : Terraformer.config.stringifyGeoJSON;
    var returnFeature = (options.feature) ? options.feature : Terraformer.config.returnFeatures;
    var result = {
      type: type
    };

    if(arcgis.spatialReference.wkid === 102100){
      arcgis = esri.geometry.webMercatorToGeographic(arcgis);
    } else if(arcgis.spatialReference.wkid !== 4326) {
      throw "Terraformer: cannot use a spatial reference system other then web mercator or geographic";
    }

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

    if(returnFeature) {
      result = {
        type: "Feature",
        bbox: [arcgis.extent.xmin, arcgis.extent.ymin, arcgis.extent.xmax, arcgis.extent.ymax],
        geometry: result
      };
    }

    if(returnString) {
      return JSON.stringify(result);
    } else {
      return result;
    }
  };

  // this takes a point line or polygon geojson object and converts it to the appropriate
  Terraformer.toArcGIS = function(geojson, opts){
    var options = (typeof opts === "undefined") ? {} : opts;
    var inputSpatialReference = new esri.SpatialReference(4326);
    var outputSpatialReference = (options.spatialReference) ? options.spatialReference : Terraformer.config.outputSpatialReference;
    var type = findGeometryType(geojson);
    var result;

    // if this is a feautre pull out its geometry and recalculate its type
    if(type === "Feature"){
      geojson = geojson.geometry;
      type = findGeometryType(geojson);
    }

    if(!((outputSpatialReference.wkid === 4326) || (outputSpatialReference.wkid === 102100))){
      throw "Terraformer: cannot use a spatial reference system other then web mercator or geographic";
    }

    switch(type){
    case "Point":
      result = new esri.geometry.Point({
        x: geojson.coordinates[0],
        y: geojson.coordinates[1],
        spatialReference: inputSpatialReference
      });
      break;
    case "MultiPoint":
      result = new esri.geometry.Multipoint({
        points: geojson.coordinates,
        spatialReference: inputSpatialReference
      });
      break;
    case "LineString":
      result = new esri.geometry.Polyline({
        paths: [geojson.coordinates],
        spatialReference: inputSpatialReference
      });
      break;
    case "MultiLineString":
      result = new esri.geometry.Polyline({
        paths: geojson.coordinates,
        spatialReference: inputSpatialReference
      });
      break;
    case "Polygon":
      result = new esri.geometry.Polygon({
        rings: geojson.coordinates,
        spatialReference: inputSpatialReference
      });
      break;
    case "MultiPolygon":
      result = new esri.geometry.Polygon({
        rings: flattenHoles(geojson.coordinates),
        spatialReference: inputSpatialReference
      });
      break;
    }

    if(outputSpatialReference.wkid === 102100){
      return esri.geometry.geographicToWebMercator(result);
    } else {
      return result;
    }
  };

  return Terraformer;
}));