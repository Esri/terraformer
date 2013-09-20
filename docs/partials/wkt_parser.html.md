### <a href="/" class="button button-light">Get WKT Parser</a>
## Well Known Text parser

[Well Known Text](http://en.wikipedia.org/wiki/Well-known_text) is a format used by databases like PostGIS. With Terraformer's WKT parser you can convert between this format and GeoJSON


    // search for a point
    var envelope = {
      x: 101,
      y: 11,
      h: 0,
      w: 0
    };

    // should call the callback with results of [ { rowId: 23 } ]
    index.search(envelope, function (err, results) {
      // results [ { rowId: 23 } ]
    });

[WKT Parser Documentation](/)