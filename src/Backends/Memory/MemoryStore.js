(function (root, factory) {
  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(["terraformer/terraformer"], factory);
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (typeof root.Terraformer === "undefined"){
      root.Terraformer = { };
    }
    if (typeof root.Terraformer.Stores === "undefined"){
      root.Terraformer.Stores = { };
    }
    root.Terraformer.Stores.Memory = factory();
  }
}(this, function() {
  var exports = { };

  // if we are in AMD terraformer core got passed in as our first requirement so we should set it.
  if(arguments[0] && typeof define === 'function' && define.amd) {
    this.Terraformer = arguments[0];
  }

  // These methods get called in context of the geostore
  function MemoryStore(){
    this.data = {};
  }


  // store the data at id returns true if stored successfully
  MemoryStore.prototype.add = function(geojson, dfd){
    this.data[geojson.id] = geojson;
    dfd.resolve(geojson);
    return dfd;
  };

  // remove the data from the index and data with id returns true if removed successfully.
  MemoryStore.prototype.remove = function(id, dfd){
    dfd.resolve(this.data[id]);
    delete this.data[id];
    return dfd;
  };

  // return the data stored at id
  MemoryStore.prototype.get = function(id, dfd){
    dfd.resolve(this.data[id]);
    return dfd;
  };

  MemoryStore.prototype.update = function(geojson, dfd){
    this.data[geojson.id] = geojson;
    dfd.resolve();
    return dfd;
  };

  exports = MemoryStore;

  return exports;
}));