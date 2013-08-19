(function (root, factory) {
  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define([], factory);
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (typeof root.Terraformer === "undefined"){
      root.Terraformer = { };
    }
    if (typeof root.Terraformer.Store === "undefined"){
      root.Terraformer.Store = {};
    }
    root.Terraformer.Store.Memory = factory().Memory;
  }
}(this, function() {
  var exports = { };

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

  // These methods get called in context of the geostore
  function Memory(){
    this.data = {};
  }

  // store the data at id returns true if stored successfully
  Memory.prototype.add = function(geojson, callback){
    if(geojson.type === "FeatureCollection"){
      for (var i = 0; i < geojson.features.length; i++) {
        this.data[geojson.features[i].id] = geojson.features[i];
      }
    } else {
      this.data[geojson.id] = geojson;
    }
    if ( callback ) callback( null, geojson);
  };

  // remove the data from the index and data with id returns true if removed successfully.
  Memory.prototype.remove = function(id, callback){
    delete this.data[id];
    if ( callback ) { 
      callback( null, id );
    }
  };

  // return the data stored at id
  Memory.prototype.get = function(id, callback){
    if ( callback ) { 
      callback( null, this.data[id] );
    }
  };

  Memory.prototype.update = function(geojson, callback){
    this.data[geojson.id] = geojson;
    if ( callback ) { 
      callback( null );
    }
  };

  Memory.prototype.serialize = function(callback){
    var data = JSON.stringify(this.data);
    if ( callback ) { 
      callback( null, data );
    }
  };

  Memory.prototype.deserialize = function(serializedStore){
    this.data = JSON.parse(serializedStore);
    return this;
  };

  exports.Memory = Memory;

  return exports;
}));
