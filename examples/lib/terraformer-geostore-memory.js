(function (root, factory) {
  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (!root.Terraformer){
      throw new Error("Terraformer.GeoStore.Memory requires the core Terraformer library. https://github.com/esri/Terraformer");
    }
    if (!root.Terraformer.GeoStore){
      throw new Error("Terraformer.GeoStore.Memory requires the Terraformer GeoStore library. https://github.com/esri/terraformer-geostore");
    }
    root.Terraformer.GeoStore.Memory = factory(root.Terraformer).Memory;
  }
}(this, function() {
  var exports = { };

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
    if (callback) {
      callback(null, geojson);
    }
  };

  // remove the data from the index and data with id returns true if removed successfully.
  Memory.prototype.remove = function(id, callback){
    delete this.data[id];
    if (callback) {
      callback(null, id);
    }
  };

  // return the data stored at id
  Memory.prototype.get = function(id, callback){
    if (callback) {
      callback(null, this.data[id]);
    }
  };

  Memory.prototype.update = function(geojson, callback){
    this.data[geojson.id] = geojson;
    if (callback) {
      callback(null, geojson);
    }
  };

  Memory.prototype.serialize = function(callback){
    var data = JSON.stringify(this.data);
    if (callback) { 
      callback(null, data);
    }
  };

  Memory.prototype.deserialize = function(serializedStore, callback){
    this.data = JSON.parse(serializedStore);
    if (callback) {
      callback();
    }
  };

  exports.Memory = Memory;

  return exports;
}));
