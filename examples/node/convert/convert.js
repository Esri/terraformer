#!/usr/bin/env node

var wkt    = require('terraformer-wkt-parser'),
    arcgis = require('terraformer-arcgis-parser'),
    fs     = require('fs');

var argv = require('optimist')
    .usage('Usage: $0 --in-format [format] --out-format [format] infile [outfile]')
    .demand(['in-format','out-format'])
    .check(function (argv) {
      if (argv._.length < 1) {
        throw "Missing infile";
      }
      if (argv['in-format'] !== 'wkt' && argv['in-format'] !== 'geojson' && argv['in-format'] !== 'arcgis') {
        throw "in-format must be one of wkt, geojson, or arcgis";
      }
      if (argv['out-format'] !== 'wkt' && argv['out-format'] !== 'geojson' && argv['out-format'] !== 'arcgis') {
        throw "out-format must be one of wkt, geojson, or arcgis";
      }
    })
    .argv;

var infile = argv._[0],
    outfile,
    data,
    primitive,
    output;

if (argv._[1]) {
  outfile = argv._[1];
}

try {
  data = fs.readFileSync(infile, 'utf8');
} catch (err) {
  console.error("ERROR: Unable to open " + infile + " for reading");
  process.exit(1);
}

if (argv['in-format'] === 'wkt') {
  primitive = wkt.parse(data);
} else if (argv['in-format'] === 'arcgis') {
  primitive = arcgis.parse(data);
} else {
  primitive = JSON.parse(data);
}

if (argv['out-format'] === 'wkt') {
  output = wkt.convert(primitive);
} else if (argv['out-format'] === 'arcgis') {
  output = JSON.stringify(arcgis.convert(primitive));
} else {
  output = primitive.toJson();
}

if (outfile) {
  try {
    fs.writeFileSync(outfile, output, 'utf8');
  } catch (err) {
    console.error("ERROR: Unable to open " + outfile + " for writing");
    process.exit(1);
  }
} else {
  process.stdout.write(output);
}
