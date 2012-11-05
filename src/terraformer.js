Terraformer = (function() {
  var Terraformer = {};

  /*****************************************************************************
  Converter Class
  *****************************************************************************/

  // Public: Duplicate some text an arbitrary number of times.
  //
  // options  - The String to be duplicated.
  // input    - The Integer number of times to duplicate the text.
  //
  // Examples
  //
  //    terraform = new Terraformer.Converter({
  //      from: "ARCGIS",
  //      to: "GEOJSON"
  //    }, myShape)
  //    geoJSON = terraform.output
  //
  // Returns an instance of Terraformer.Converter
  Terraformer.Converter = function(options, input){
    this.input = input;
    this.options = options;
  };

  Terraformer.Converter.prototype.async = {};

  Terraformer.Converter.prototype.async.from = function(format){
    return this;
  };

  Terraformer.Converter.prototype.async.to = function(format){
    return this;
  };

  Terraformer.Converter.prototype.async.run = function(callback){
    return this;
  };

  Terraformer.Converter.prototype.async.convert = function(data, callback){
    return this;
  };


  Terraformer.Converter.prototype.setFromAutomatically = function(){
    if(helpers.arcgis.isArcGIS(this.input)){
      this.options.from = Terraformer.Formats.ARCGIS;
    } else if(helpers.geojson.isGeoJSON(this.input)) {
      this.options.from = Terraformer.Formats.GEOJSON;
    }
  };

  Terraformer.Converter.prototype.setTypeAutomatically = function(){
    switch(this.options.from) {
      case Terraformer.Formats.ARCGIS:
        this.options.type = helpers.arcgis.typeOf(this.input);
        break;
      case Terraformer.Formats.GOOGLE:
        break;
      case Terraformer.Formats.LEAFLET:
        break;
      case Terraformer.Formats.GEOJSON:
        break;
    }
  };

  Terraformer.Converter.prototype.from = function(format){
    if(Terraformer.Formats.find(format)){
      this.options.from  = format;
    } else {
      throw "Terraformer: format '" + format  +"' is not a valid format";
    }
    return this;
  };

  Terraformer.Converter.prototype.to = function(format){
    if(Terraformer.Formats.find(format)){
      this.options.to = format;
    } else {
      throw "Terraformer: format '" + format  +"' is not a valid format";
    }
    if(this.options.to && this.options.from && this.input) {
      this.output = this.convert(this.input);
      return this.output;
    }
    return this;
  };

  Terraformer.Converter.prototype.convert = function(data){
    this.input = (data) ? data : this.input;

    if(!this.options.to || !this.options.from) {
      throw "Terraformer: you have asked to convert data but have not supplied the input and output format";
    }

    // set from automatically
    if(!this.options.from) {
      this.setFromAutomatically();
    }

    // set the type
    if(!this.options.type) {
      this.setTypeAutomatically();
    }
        
    // convert the from into a neutal state
    switch(this.options.from) {
      case Terraformer.Formats.ARCGIS:
        this.neutral = helpers.arcgis.graphicOrGeometryToGeographic(this.input);
        break;
      case Terraformer.Formats.GOOGLE:
        break;
      case Terraformer.Formats.LEAFLET:
        break;
      case Terraformer.Formats.GEOJSON:
        break;
    }

    // convert the neutral into the output nested switch is ugly
    switch(this.options.to) {
      case Terraformer.Formats.ARCGIS:
        break;
      case Terraformer.Formats.GOOGLE:
        break;
      case Terraformer.Formats.LEAFLET:
        break;
      case Terraformer.Formats.GEOJSON:
        switch(this.options.type) {
          case Terraformer.Types.POINT:
            this.output = {
              "type": "Point",
              "coordinates": [this.neutral.x, this.neutral.y]
            };
            break;
          case Terraformer.Types.POLYLINE:
            this.output = {
              "type": "LineString",
              "coordinates": this.neutral.geometry.paths[0]
            };
            break;
          case Terraformer.Types.POLYGON:
            this.output = {
              "type": "Polygon",
              "coordinates": this.neutral.geometry.rings[0]
            };
            break;
        }
        break;
    }

    return this.output;
  };

  Terraformer.convert = function(input){
    return new Terraformer.Converter({}, input);
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

  Terraformer.Formats = new Enum("ARCGIS", 'GOOGLE', 'LEAFLET', 'GEOJSON');
  Terraformer.Types = new Enum("POINT", 'POLYLINE', 'POLYGON');

  /*****************************************************************************
  ArcGIS Helpers

  Helpers for dealing with the ArcGIS Javascript
  *****************************************************************************/

  var helpers = {};

  helpers.arcgis = {
    isArcGIS: function(){
      if(helpers.arcgis.isPoint(input) || helpers.arcgis.isPolyline(input) || helpers.arcgis.isPolygon(input)){
        return true;
      } else {
        return false;
      }
    },

    typeOf: function(input){
      if(helpers.arcgis.isPoint(input)){
        return Terraformer.Types.POINT;
      } else if (helpers.arcgis.isPolyline(input)) {
        return Terraformer.Types.POLYLINE;
      } else if (helpers.arcgis.isPolygon(input)) {
        return Terraformer.Types.POLYGON;
      } else {
        return false;
      }
    },

    isPoint: function(input){
      var geometry =  (helpers.arcgis.isGeometry(input)) ? input : input.geometry;
      if(geometry.x && geometry.y) {
        return true;
      } else {
        return false;
      }
    },

    isPolyline: function(){
      var geometry =  (helpers.arcgis.isGeometry(input)) ? input : input.geometry;
      if(geometry.paths) {
        return true;
      } else {
        return false;
      }
    },

    isPolygon: function(){
      if(geometry.rings) {
        return true;
      } else {
        return false;
      }
    },

    graphicOrGeometryToGeographic: function(input){
      if(helpers.arcgis.isGeometry(input)){
        return helpers.arcgis.convertToGeographic(input);
      } else {
        return helpers.arcgis.convertToGeographic(input.geometry);
      }
    },

    // check if an object is a geometry
    isGeometry: function(object){
      return (object.spatialReference) ? true : false;
    },
    
    // check if an object is a graphic
    isGraphic: function(object){
      return (object.geometry) ? true : false;
    },

    // Check if a geometry or graphic is Geographic (Lat,Lng)
    isGeographic: function(object){
      if(helpers.arcgis.isGraphic(object)){
        return object.geometry.spatialReference.wkid === 4326;
      } else if(helpers.arcgis.isGeometry(object)) {
        return object.spatialReference.wkid === 4326;
      } else {
        return false;
      }
    },

    // Check if a geometry or graphic is In Web Mercator
    isWebMercator: function(object){
      if(helpers.arcgis.isGraphic(object)){
        return object.geometry.spatialReference.wkid === 10200;
      } else if(helpers.arcgis.isGeometry(object)) {
        return object.spatialReference.wkid === 10200;
      } else {
        return false;
      }
    },

    // Convert a geometry to webmercator if neccessary
    convertToWebMercator: function(geometry){
      if(helpers.arcgis.isGeographic(geometry)) {
        return esri.geometry.geographicToWebMercator(geometry);
      } else if(helpers.arcgis.isWebMercator(geometry)){
        return geometry;
      }
    },

    convertToGeographic: function(geometry){
      if(helpers.arcgis.isWebMercator(geometry)) {
        return esri.geometry.webMercatorToGeographic(geometry);
      } else if(helpers.arcgis.isGeographic(geometry)){
        return geometry;
      }
    }
  };

  helpers.geojson = {
    isGeoJSON: function(input){
      return (input.coordinates) ? true : false;
    }
  };

  Terraformer.helpers = helpers;

  return Terraformer;
}());
