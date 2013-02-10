var fs    = require('fs'),
    http  = require('http'),
    url   = require('url'),
    Terraformer = require('terraformer'),
    index = require('terraformer-rtree');

// Source data from
// http://efele.net/maps/tz/world/

// initialize the rtree index
var tree = new index.RTree();

// some sort of timer
var start = new Date();

// and find a place to store the places
var places = [ ];

// and a rowId - starting at -1 so first increment is correct
var rowId = -1;

var timezones = JSON.parse(fs.readFileSync('./tz_world/tz_world_mp.json', 'utf8'));

// iterate through each of the file
for(var i = 0; i < timezones.features.length; i++) {
  var zone = timezones.features[i];

  // create a new primitive we can manipulate.
  var primitive = new Terraformer.Primitive(zone);

  // set the rowId
  rowId++;

  // add to in memory store
  places[rowId] = primitive;

  // and insert the envelope into the index
  tree.insert(primitive.envelope(), { rowId: rowId });
}

console.log("time spent indexing: " + ((new Date() - start) / 1000) + "s, " + rowId + " rows");

// create an http server that can respond to requests
var server = http.createServer(function (request, response) {
  var start = new Date();

  // get the parsed url
  var parsed = url.parse(request.url, true);
  var packet;

  // we will answer on anything, as long as we have a latitude and longitude
  if (parsed.query.latitude === undefined || parsed.query.longitude === undefined) {
    // return a packet that denotes an error
    packet = {
      status: "error",
      error: "required fields: latitude and longitude"
    };

  } else {
    var envelope = {
      x: Number(parsed.query.longitude),
      y: Number(parsed.query.latitude),
      w: 0,
      h: 0
    };

    // we have a latitude and longitude, search for a match in the index
    tree.search(envelope, function (err, results) {
      if (err) {
        // if there is an error, return it
        packet = {
          status: "error",
          error: err
        };
      } else {
        // otherwise, find the polygon that contain the latitude and longitude
        var found = false;
        for (var i = 0; i < results.length; i++) {
          // since we are using Terraformer, we can check containsPoint()
          var rowId = results[i].rowId;
          if (places[rowId].contains({ type: "Point", coordinates: [ parsed.query.longitude, parsed.query.latitude ] })) {
            found = places[results[i].rowId].properties.TZID;
          }
        }

        if (found) {
          packet = {
            status: "ok",
            timezone: found
          };
        } else {
          packet = {
            status: "not_found"
          };
        }
      }

    });

    response.writeHead(200, {
      'Content-Type': 'application/json',
      'Search-Duration': "" + (new Date() - start) + " ms"
    });
    response.end(JSON.stringify(packet));
  }
});

console.log("Listening on port 8080");
server.listen(8080);

