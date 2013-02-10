# Timezone API

## Example Usage

```
$ curl "http://localhost:8080/?latitude=45.5118&longitude=-122.6433"

{
  "status": "ok",
  "timezone": "America/Los_Angeles"
}
```

## Installation

```
$ npm install
```

This will download terraformer, the rtree index for terraformer, and other required modules.

## Setup

First download the latest timezone data from http://efele.net/maps/tz/world/

The download is available as a shapefile so you will need to convert it to GeoJSON format first.

Alternately, you can download the JSON data from here: https://github.com/aaronpk/tz_world

From the `timezone` folder,

```
$ git clone https://github.com/aaronpk/tz_world.git
$ cd tz_world
$ ./unzip.sh
```

That will download the JSON data and unzip into the folder. Then you can run the server.

```
$ node index.js
```

This will load the JSON file (should take about 4 seconds to parse and build the index), 
and you will then have a server running on port 8080.

You can then run a query like in the example above!
