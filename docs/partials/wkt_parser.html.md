<header class="subhead">
  <img src="/img/terraformer-wktparser.png" alt="terraformer WKT Parser">
  <h2>Well Known Text Parser</h2>
  <h3><a href="/" class="button button-light">Get WKT Parser</a></h3>
</header>

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