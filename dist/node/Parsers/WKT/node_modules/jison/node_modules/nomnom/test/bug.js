var nomnom = require("../nomnom"),
    assert = require("assert");
    
var opts = {
  date : {
    string: "-d Y, --date=Y",
    callback: function(date) {
      assert.equal(date, "2010-03-02", "date argument is wrong");
    }
  }
}

var options = nomnom().opts(opts).parseArgs(["-d", "2010-03-02"]);