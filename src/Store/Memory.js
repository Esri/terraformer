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

  // if we are in AMD terraformer core got passed in as our first requirement so we should set it.
  if(arguments[0] && typeof define === 'function' && define.amd) {
    this.Terraformer = arguments[0];
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

  Memory.prototype.serialize = function(dfd){
    dfd.resolve(JSON.stringify(this));
    return dfd;
  };

  Memory.prototype.deserialize = function(serializedStore){
    this.data = JSON.parse(serializedStore).data;
    dfd.resolve(this);
    return dfd;
  };

  exports.Memory = Memory;

  return exports;
}));