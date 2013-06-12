(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(["terraformer/terraformer"],factory);
  }

  // Browser Global.
  if(typeof navigator === "object") {
    if (typeof root.Terraformer === "undefined"){
      root.Terraformer = {};
    }
    root.Terraformer.WKT = factory();
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

  "SOURCE";

  function PointArray (point) {
    this.data = [ point ];
    this.type = 'PointArray';
  }

  PointArray.prototype.addPoint = function (point) {
    if (point.type === 'PointArray') {
      this.data = this.data.concat(point.data);
    } else {
      this.data.push(point);
    }

    return this;
  };

  PointArray.prototype.toJSON = function () {
    return this.data;
  };

  function Ring (point) {
    this.data = point;
    this.type = 'Ring';
  }

  Ring.prototype.toJSON = function () {
    var data = [ ];

    for (var i = 0; i < this.data.data.length; i++) {
      data.push(this.data.data[i]);
    }

    return data;
  };

  function RingList (ring) {
    this.data = [ ring ];
    this.type = 'RingList';
  }

  RingList.prototype.addRing = function (ring) {
    this.data.push(ring);

    return this;
  };

  RingList.prototype.toJSON = function () {
    var data = [ ];

    for (var i = 0; i < this.data.length; i++) {
      data.push(this.data[i].toJSON());
    }

    if (data.length === 1) {
      return data;
    } else {
      return data;
    }
  };

  function PolygonList (polygon) {
    this.data = [ polygon ];
    this.type = 'PolygonList';
  }

  PolygonList.prototype.addPolygon = function (polygon) {
    this.data.push(polygon);

    return this;
  };

  PolygonList.prototype.toJSON = function () {
    var data = [ ];

    for (var i = 0; i < this.data.length; i++) {
      data = data.concat( [ this.data[i].toJSON() ] );
    }

    return data;
  };

  function _parse () {
    return parser.parse.apply(parser, arguments);
  }

  function parse (element) {
    var res, primitive;

    try {
      res = parser.parse(element);
    } catch (err) {
      throw Error("Unable to parse", err);
    }

    return Terraformer.Primitive(res);
  }

  exports.parser = parser;
  exports.Parser = parser.Parser;
  exports.parse = parse;

  return exports;
}));