var sys = require("sys"),
    fs = require("fs"),
    path = require("path");

function testFile(test) {
  var test = test.replace(".js", "");
  try {
    require(test);
    sys.puts("PASS " + path.basename(test));
  }
  catch(e) {
    var msg = "FAIL " + test + ": " +  e;
    if(e.expected != true)
      msg += ", expected: " + JSON.stringify(e.expected)
             + " actual: " + JSON.stringify(e.actual);
    sys.puts(msg);
  }
}


var tests = [];
tests = fs.readdirSync(__dirname)
  .filter(function(test) {
    if(test != path.basename(__filename))
      return true;
    return false;
  })
  .map(function(test) {
    return path.join(__dirname, test);
  });
tests.forEach(testFile);