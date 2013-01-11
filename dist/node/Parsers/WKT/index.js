var parser = require('./parser');

var terraformer = require('terraformer');



function parse (element) {
  var res, primitive;

  try {
    res = parser.parse(element);
  } catch (err) {
    throw Error("Unable to parse", err);
  }

  switch (res.type) {
    case 'Point':
    primitive = terraformer.Point(res);
    break;

    case 'Polygon':
    primitive = terraformer.Polygon(res);
    break;

    case 'LineString':
    primitive = terraformer.LineString(res);
    break;

    case 'MultiPoint':
    primitive = terraformer.MultiPoint(res);
    break;

    case 'MultiLineString':
    primitive = terraformer.MultiLineString(res);
    break;

    case 'MultiPolygon':
    primitive = terraformer.MultiPolygon(res);
    break;

    default:
    throw Error("Unknown type: " + res.type);
  }

  return res;
}

exports.parser = parser;
exports.parse = parse;