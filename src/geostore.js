(function (root, factory) {
  if(typeof module === 'object' && typeof module.exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    Terraformer = require('terraformer');
    exports = module.exports = factory();
  }else if(typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module and pass in Terraformer core as a requirement...
    define(["terraformer/terraformer"],factory);
  } else {
    if (typeof root.Terraformer === "undefined") {
      root.Terraformer = {};
    }

    root.Terraformer.GeoStore = factory();
  }
}(this, function() {
  var exports = { };

  // if we are in AMD terraformer core got passed in as our first requirement so we should set it.
  if(arguments[0] && typeof define === 'function' && define.amd) {
    this.Terraformer = arguments[0];
  }

  function bboxToEnvelope(bbox){
    return {
      x: bbox[0],
      y: bbox[1],
      width: Math.abs(bbox[2]-bbox[0]),
      height: Math.abs(bbox[3]-bbox[1])
    };
  }

  function s4(){
    return Math.floor(Math.random() * 0x10000).toString(16);
  }

  function guid(){
    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
  }

  // The store object that ties everything together...
  /* OPTIONS
  {
    backend: Terraformer.Stores.Memory,
    index: Terraformer.RTree,
    deferred: Terraformer.Deferred,
    data: [Geojson to be added into the store]
  }
  */
  function GeoStore(options){
    this.index = options.index || new Terraformer.RTree();
    this.backend = options.backend || new Terraformer.Stores.Memory();
    this.backend = options.deferred || Terraformer.Deferred;
    options.data = options.data || [];
    while(data.length){
      this.add(options.data.shift());
    }
  }

  GeoStore.prototype.add = function(geojson){
    // add the geojson object to the backend
    // calculate the envelope and add it to the rtree
    // should return a deferred
    var id = (geojson.id) ? geojson.id : guid();
    var bbox = (geojson.bbox) ? geojson.bbox() : Terraformer.Tools.calculateBounds(geojson);
    var envelope = bboxToEnvelope(bbox);
    this.backend.store(geojson, id);
    this.index.inset(envelope, id);
  };

  GeoStore.prototype.remove = function(query){
    // removes a geojson object from the store by id or by query.
    // if string find by id and remove it from the store and the envelope
    // if query query the store and remove all results from the store
    // should return a deferred
  };

  GeoStore.prototype.query = function(query){
    // query the store should take options like...
    // properties - this will have to just loop over every item should occur after a geographic query
    // ids
    // center/distance
    // point
    // polygon
    // should return a deferred
  };

  GeoStore.prototype.update = function(geojson){
    // updates an existing object in the store and the index
    // accepts a geojson object and uses its id to find and update the item
    // should return a deferred
  };

  GeoStore.prototype.get = function(id){
    // gets an item by id
    // should return a deferred
  };

  exports.GeoStore = GeoStore;

  return exports;
}));