var nomnom = require("../nomnom"),
    assert = require("assert");
    
var opts = {
  target : {
    position: 0
  },
  
  config : {
    string: '-c FILE, --config=FILE',
    help: 'JSON manifest of cross-validation tests to run'
  },

  db : {
    string: '-d URL, --db=URL',
    help: 'url to CouchDB database of training data',
    default: 'http://localhost:5984/test'
  },

  options : {
    string: '-o JSON, --options=JSON',
    help: 'options to pass to classifier'
  },

  type : {
    string: '-t [neuralnetwork|bayesian], --type=TYPE',
    help: 'type of classifier/network to test'
  },

  verbose : {
    string: '-v, --verbose',
    help: 'print more messages'
  },

  debug : {
    help: 'debug mode'
  },

  report : {
    string: '-r COUCHDB, --report=COUCHDB',
    help: 'couch db to post results to',
    default: "test.db"
  },
 
  reportName : {
    string: '-n NAME, --report-name=NAME',
    help: 'name of results report'
  },
};


var options = nomnom().parseArgs(opts, {argv: ["-c", "other.json", "--debug=false", "-v", "neuralnetwork",
  "-d", "http://db", "--options={}"]});

assert.equal(options.target, "neuralnetwork");
assert.equal(options.config, "other.json");
assert.equal(options.debug, false);
assert.equal(options.db, "http://db");
assert.equal(options.report, "test.db");
assert.deepEqual(options.options, {});
assert.ok(!options.reportName);