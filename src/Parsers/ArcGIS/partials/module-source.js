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
    if (root.Terraformer === undefined) {
      root.Terraformer = { };
    }

    root.Terraformer.WKT = factory();
  }
}(this, function() {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var Terraformer = require('terraformer');
  }
  
  var exports = { };

  "SOURCE";


  return exports;
}));