(function (root, factory) {
  if(typeof module === 'object' && typeof module.exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    exports = module.exports = factory();
  }else if(typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module and pass in Terraformer core as a requirement...
    define(factory);
  } else {
    if (typeof root.Terraformer === "undefined") {
      root.Terraformer = {};
    }

    root.Terraformer.Deferred = factory();
  }
}(this, function() {
  var exports = { };

  // Do Stuff

  return exports;
}));