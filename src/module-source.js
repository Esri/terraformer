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

  function arrayToRing (arr) {
    var parts = [ ], ret = '';

    for (var i = 0; i < arr.length; i++) {
      parts.push(arr[i].join(' '));
    }

    ret += '(' + parts.join(', ') + ')';

    return ret;

  }

  function pointToWKTPoint (primitive) {
    var ret = 'POINT ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates.length === 3) {
      // 3d or time? default to 3d
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates.length === 4) {
      // 3d and time
      ret += 'ZM ';
    }

    // include coordinates
    ret += '(' + primitive.coordinates.join(' ') + ')';

    return ret;
  }

  function lineStringToWKTLineString (primitive) {
    var ret = 'LINESTRING ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0].length === 4) {
      ret += 'ZM ';
    }

    ret += arrayToRing(primitive.coordinates);

    return ret;
  }

  function polygonToWKTPolygon (primitive) {
    var ret = 'POLYGON ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0][0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0][0].length === 4) {
      ret += 'ZM ';
    }

    ret += '(';
    var parts = [ ];
    for (var i = 0; i < primitive.coordinates.length; i++) {
      parts.push(arrayToRing(primitive.coordinates[i]));
    }

    ret += parts.join(', ');
    ret += ')';

    return ret;
  }

  function multiPointToWKTMultiPoint (primitive) {
    var ret = 'MULTIPOINT ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0].length === 4) {
      ret += 'ZM ';
    }

    ret += arrayToRing(primitive.coordinates);

    return ret;
  }

  function multiLineStringToWKTMultiLineString (primitive) {
    var ret = 'MULTILINESTRING ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0][0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0][0].length === 4) {
      ret += 'ZM ';
    }

    ret += '(';
    var parts = [ ];
    for (var i = 0; i < primitive.coordinates.length; i++) {
      parts.push(arrayToRing(primitive.coordinates[i]));
    }

    ret += parts.join(', ');
    ret += ')';

    return ret;
  }

  function multiPolygonToWKTMultiPolygon (primitive) {
    var ret = 'MULTIPOLYGON ';

    if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
      ret += 'EMPTY';

      return ret;
    } else if (primitive.coordinates[0][0][0].length === 3) {
      if (primitive.properties && primitive.properties.m === true) {
        ret += 'M ';
      } else {
        ret += 'Z ';
      }
    } else if (primitive.coordinates[0][0][0].length === 4) {
      ret += 'ZM ';
    }

    ret += '(';
    var inner = [ ];
    for (var c = 0; c < primitive.coordinates.length; c++) {
      var it = '(';
      var parts = [ ];
      for (var i = 0; i < primitive.coordinates[c].length; i++) {
        parts.push(arrayToRing(primitive.coordinates[c][i]));
      }

      it += parts.join(', ');
      it += ')';

      inner.push(it);
    }

    ret += inner.join(', ');
    ret += ')';

    return ret;
  }

  function convert (primitive) {
    switch (primitive.type) {
      case 'Point':
        return pointToWKTPoint(primitive);
      case 'LineString':
        return lineStringToWKTLineString(primitive);
      case 'Polygon':
        return polygonToWKTPolygon(primitive);
      case 'MultiPoint':
        return multiPointToWKTMultiPoint(primitive);
      case 'MultiLineString':
        return multiLineStringToWKTMultiLineString(primitive);
      case 'MultiPolygon':
        return multiPolygonToWKTMultiPolygon(primitive);
      default:
        throw Error ("Unknown Type: " + primitive.type);
    }
  }



  exports.parser  = parser;
  exports.Parser  = parser.Parser;
  exports.parse   = parse;
  exports.convert = convert;

  return exports;
}));