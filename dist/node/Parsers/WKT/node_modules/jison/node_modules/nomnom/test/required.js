var nomnom = require("../nomnom"),
    assert = require("assert");
    
var opts = {
  filename : {
    position: 0,
    required: true
  }
}

nomnom().parseArgs(opts, { argv: [], printFunc : function(str) {
  assert.equal(str, "filename argument is required");
}});

nomnom().parseArgs(opts, { argv: [] });

assert.ok(false, "program should have exited when required arg wasn't present");