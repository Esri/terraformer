# Well Known Text

Well Known Text is a first class citizen in Terraformer.

You can `parse` WKT and `convert` into WKT.  When parsing, these become [Terraformer.Primitive](Primitives.md) objects.  When converting, these become WKT strings.

## Using

### Node.js

    var wkt = require('terraformer-wkt-parser');

### Browser

    <script src="terraformer.js" type="text/javascript"></script>
    <script src="wkt.js" type="text/javascript"></script>

## Parsing

Parsing returns a `Terraformer.Primitive` object from Well Known Text.

### Node.js

    var point = wkt.parse("POINT(10 10)");

### Browser

    <script type="text/javascript">
      var point = Terraformer.WKT.parse("POINT(10 10)");
    </script>
