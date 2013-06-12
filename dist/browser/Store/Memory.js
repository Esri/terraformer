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
    Terraformer = require('../terraformer.js');
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
  Memory.prototype.add = function(geojson, dfd){
    if(geojson.type === "FeatureCollection"){
      for (var i = 0; i < geojson.features.length; i++) {
        this.data[geojson.features[i].id] = geojson.features[i];
      }
    } else {
      this.data[geojson.id] = geojson;
    }
    dfd.resolve(geojson);
    return dfd;
  };

  // remove the data from the index and data with id returns true if removed successfully.
  Memory.prototype.remove = function(id, dfd){
    delete this.data[id];
    dfd.resolve(id);
    return dfd;
  };

  // return the data stored at id
  Memory.prototype.get = function(id, dfd){
    dfd.resolve(this.data[id]);
    return dfd;
  };

  Memory.prototype.update = function(geojson, dfd){
    this.data[geojson.id] = geojson;
    dfd.resolve();
    return dfd;
  };

  Memory.prototype.serialize = function(callback){
    // make a new deferred
    var dfd = new Terraformer.Deferred();
    var data = JSON.stringify(this.data);

    // map callback to dfd if we have one
    if(callback){
      dfd.then(function(result){
        callback(null, result);
      }, function(error){
        callback(error, null);
      });
    }

    dfd.resolve(data);

    return dfd;
  };

  Memory.prototype.deserialize = function(serializedStore){
    this.data = JSON.parse(serializedStore);
    return this;
  };

  exports.Memory = Memory;

  return exports;
}));