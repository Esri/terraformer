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

exports.convert = convert;
