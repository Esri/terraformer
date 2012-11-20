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

  var findGeometryType = function(input){

    if(input.coordinates && input.type){
      if(input.type === "Point"){
        return Terraformer.Types.POINT;
      }
      if(input.type === "LineString"){
        return Terraformer.Types.LINE;
      }
      if(input.type === "Polygon"){
        return Terraformer.Types.POLYGON;
      }
      if(input.type === "MultiPoint"){
        return Terraformer.Types.MULTIPOINT;
      }
      if(input.type === "MultiLineString"){
        return Terraformer.Types.MULTILINE;
      }
      if(input.type === "MultiPolygon"){
        return Terraformer.Types.MULTIPOLYGON;
      }
      if(input.type === "Feature"){
        return Terraformer.Types.FEATURE;
      }
      throw "Terraformer: invalid GeoJSON object. Are you sure your data is properly formatted?";
    }

    if(input.spatialReference){
      if(input.x && input.y){
        return Terraformer.Types.POINT;
      }
      if(input.points){
        return Terraformer.Types.MULTIPOINT;
      }
      if(input.paths) {
        return (input.paths.length === 1) ? Terraformer.Types.LINE : Terraformer.Types.MULTILINE;
      }
      if(input.rings) {
        return (input.rings.length === 1) ? Terraformer.Types.POLYGON : Terraformer.Types.MULTIPOLYGON;
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
    var result;

    if(arcgis.spatialReference.wkid === 102100){
      arcgis = esri.geometry.geographicToWebMercator(arcgis);
    } else if(arcgis.spatialReference.wkid !== 4326) {
      throw "Terraformer: cannot use a spatial reference system other then web mercator or geographic";
    }

    switch(type){
    case Terraformer.Types.POINT:
      result = {
        type: "Point",
        coordinates: [arcgis.x, arcgis.y]
      };
      break;
    case Terraformer.Types.MULTIPOINT:
      result = {
        type: "MultiPoint",
        coordinates: arcgis.points
      };
      break;
    case Terraformer.Types.LINE:
      result = {
        type: "LineString",
        coordinates: arcgis.paths[0]
      };
      break;
    case Terraformer.Types.MULTILINE:
      result = {
        type: "MultiLineString",
        coordinates: arcgis.paths
      };
      break;
    case Terraformer.Types.POLYGON:
      result = {
        type: "Polygon",
        coordinates: arcgis.rings[0]
      };
      break;
    case Terraformer.Types.MULTIPOLYGON:
      result = {
        type: "MultiPolygon",
        coordinates: arcgis.rings
      };
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
    if(type === Terraformer.Types.FEATURE){
      geojson = geojson.geometry;
      type = findGeometryType(geojson);
    }

    if(!((outputSpatialReference.wkid === 4326) || (outputSpatialReference.wkid === 102100))){
      throw "Terraformer: cannot use a spatial reference system other then web mercator or geographic";
    }

    switch(type){
    case Terraformer.Types.POINT:
      result = new esri.geometry.Point({
        x: geojson.coordinates[0],
        y: geojson.coordinates[1],
        spatialReference: inputSpatialReference
      });
      break;
    case Terraformer.Types.MULTIPOINT:
      result = new esri.geometry.Multipoint({
        points: geojson.coordinates,
        spatialReference: inputSpatialReference
      });
      break;
    case Terraformer.Types.LINE:
      result = new esri.geometry.Polyline({
        paths: [geojson.coordinates],
        spatialReference: inputSpatialReference
      });
      break;
    case Terraformer.Types.MULTILINE:
      result = new esri.geometry.Polyline({
        paths: geojson.coordinates,
        spatialReference: inputSpatialReference
      });
      break;
    case Terraformer.Types.POLYGON:
      result = new esri.geometry.Polygon({
        rings: [geojson.coordinates],
        spatialReference: inputSpatialReference
      });
      break;
    case Terraformer.Types.MULTIPOLYGON:
      result = new esri.geometry.Polygon({
        rings: geojson.coordinates,
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

  /*****************************************************************************
  EMUMS

  This makes real ENUMS in your browser.
  From: http://www.2ality.com/2011/10/enums.html
  *****************************************************************************/

  function Symbol(name) {
    this.name = name;
    Object.freeze(this);
  }
  
  Symbol.prototype = Object.create(null);
  Symbol.prototype.constructor = Symbol;
  
  Symbol.prototype.toString = function () {
    return "|"+this.name+"|";
  };

  Object.freeze(Symbol.prototype);

  Enum = function (obj) {
    Array.prototype.forEach.call(arguments, function (name) {
      this[name] = new Symbol(name);
    }, this);
    Object.freeze(this);
  };

  Enum.prototype.symbols = function() {
    return Object.keys(this).map(
      function(key) {
        return this[key];
      }, this
    );
  };
  
  Enum.prototype.contains = function(sym) {
    if (! sym instanceof Symbol){
       return false;
    }
    return this[sym.name] === sym;
  };

  Enum.prototype.find = function(sym) {
    if(this[sym]){
      return this[sym];
    } else if(this[sym.name]) {
      return this[sym.name];
    }
  };

  Terraformer.Types = new Enum("POINT", 'LINE', 'POLYGON', 'MULTIPOINT', 'MULTILINE', 'MULTIPOLYGON', 'FEATURE');

  return Terraformer;
}));