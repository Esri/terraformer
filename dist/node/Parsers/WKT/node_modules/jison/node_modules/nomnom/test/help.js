var nomnom = require("../nomnom"),
    sys = require("sys"),
    assert = require("assert");

function strip(str) {
  return str.replace(/\s+/g, '');  
};

var opts = [
  { name: 'config',
    string: '-c, --config=PATH',
    default: 'config.json',
    help: 'JSON config with test info'},

  { name: 'logfile',
    string: '-l LOG'}
];
var parser = nomnom();
parser.parseArgs(opts, {script: 'test.js', printHelp: false});

assert.equal(strip(parser.getUsage()), strip("Usage:test.js[options]options:-c,--config=PATHJSONconfigwithtestinfo-lLOG"));
var opts = [
  { name: 'aname0',
    position: 0},
    
  { name: 'aname2',
    position: 2},

  { name: 'debug',
    string: '-d'},

  { name: 'aname1',
    position: 1}
];

parser = nomnom();
parser.parseArgs(opts, {script: 'test.js', printHelp: false});

assert.equal(strip(parser.getUsage()), strip("Usage:test.js<aname0><aname1><aname2>[options]<aname0><aname1><aname2>options:-d"));
