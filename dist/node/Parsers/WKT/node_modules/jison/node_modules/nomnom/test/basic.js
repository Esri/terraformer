var nomnom = require("../nomnom"),
    assert = require("assert");
    
var opts = [
  { name: 'target',
    position: 0
  },
  
  { name: 'config',
    string: '-c FILE, --config=FILE',
    help: 'JSON manifest of cross-validation tests to run'
  },

  { string: '-d URL, --db=URL',
    help: 'url to CouchDB database of training data',
    default: 'http://localhost:5984/test'
  },

  { string: '-o JSON, --options=JSON',
    help: 'options to pass to classifier'
  },

  { string: '-t [neuralnetwork|bayesian], --type=TYPE',
    help: 'type of classifier/network to test'
  },

  { name: 'verbose',
    string: '-v, --verbose',
    help: 'print more messages'
  },

  { name: 'debug',
    help: 'debug mode'
  },

  { name: 'report',
    string: '-r COUCHDB, --report=COUCHDB',
    help: 'couch db to post results to',
    default: "test.db"
  },
 
  { name: 'reportName',
    string: '-n NAME, --report-name=NAME',
    help: 'name of results report'
  },
];


var options = nomnom().parseArgs(opts, { argv: ["-c", "other.json", "--debug=false", "-v", "neuralnetwork",
  "-d", "http://db", "--options={}"]});

assert.equal(options.target, "neuralnetwork");
assert.equal(options.config, "other.json");
assert.equal(options.debug, false);
assert.equal(options.db, "http://db");
assert.equal(options.report, "test.db");
assert.deepEqual(options.options, {});
assert.ok(!options.reportName);