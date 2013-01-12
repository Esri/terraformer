(function (root, factory) {

  if(typeof module === 'object' && typeof module.exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    exports = module.exports = factory();
  }else if(typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    if (Terraformer === undefined){
      root.Terraformer = { };
    }
    root.Terraformer.ArcGIS = factory();
  }

  if(typeof jasmine === "object") {
    if (root.Terraformer === undefined){
      root.Terraformer = { };
    }
    root.Terraformer.ArcGIS = factory();
  }

}(this, function(){
  var exports = {};

  // This function flattens holes in multipolygons to one array of polygons
  function flattenHoles(array){
    var output = [], polygon;
    for (var i = 0; i < array.length; i++) {
      polygon = array[i];
      if(polygon.length > 1){
        for (var ii = 0; ii < polygon.length; ii++) {
          output.push(polygon[ii]);
        }
      } else {
        output.push(polygon[0]);
      }

    }
    return output;
  }

  function findGeometryType(input){
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
    } else {
      throw "Terraformer: invalid ArcGIS input. Are you sure your data is properly formatted?";
    }
  }

  // this takes an arcgis geometry and converts it to geojson
  function parse(arcgis){
    var type = findGeometryType(arcgis);
    var geojson = {
      type: type
    };

    if(arcgis.spatialReference.wkid === 102100) {
      geojson.crs = Terraformer.MercatorCRS;
    }

    switch(type){
    case "Point":
      geojson.coordinates = [arcgis.x, arcgis.y];
      break;
    case "MultiPoint":
      geojson.coordinates = arcgis.points;
      break;
    case "LineString":
      geojson.coordinates = arcgis.paths[0];
      break;
    case "MultiLineString":
      geojson.coordinates = arcgis.paths;
      break;
    case "Polygon":
      geojson.coordinates = arcgis.rings;
      break;
    case "MultiPolygon":
      geojson.coordinates = arcgis.rings;
      break;
    }

    return new Terraformer.Primitive(geojson);
  }

  // this takes a point line or polygon geojson object and converts it to the appropriate
  function convert(geojson, spatialReference){
    var result = {
      spatialReference: spatialReference || { wkid: 4326 }
    };

    // if this is a feautre pull out its geometry and recalculate its type
    if(geojson.type === "Feature"){
      geojson = geojson.geometry;
    }

    switch(geojson.type){
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
  }

  exports.parse = parse;
  exports.convert = convert;

  return exports;
}));