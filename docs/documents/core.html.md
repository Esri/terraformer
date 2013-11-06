---
layout: default
---

# Terraformer Core

### Primitive
Terraformer Primitives are Javascript objects that map directly to their GeoJSON components. Converting a GeoJSON object into a Terraformer Primitive will allow you use convenience methods like `point.within(polygon)`.

Every `Terraformer.Primitive` inherits from this base class, thus all other Primitives share all the `Terraformer.Primitive` methods.

There is a Primitive for every type of GeoJSON object.

* [Point]()
* [LineString]()
* [Polygon]()
* [MultiPoint]()
* [MultiLineString]()
* [MultiPolygon]()
* [Feature]()
* [FeatureCollection]()
* [GeometryCollection]()
* [Circle]()

#### Constructor
You create new `Terraformer.Primitive` objects by passing it a valid [GeoJSON Point](). This will return the a `Terraformer.Primitive` of the type that cooresponds with type of your GeoJSON object.

```js
var point = new Terraformer.Primitive({
  type:"Point", 
  coordinates:[1,2]
});

point instanceof Terraformer.Point; //-> true

point.within(polygon) //-> true or false
```

#### Methods

| Method | Returns | Description
| --- | --- | --- |
| `toMercator` | `this` | ... |
| `toGeographic` | `this` | ... |
| `envelope` | `Object` | ... |
| `bbox` | `Array` | ... |
| `convexHull` | `Polygon` | ... |
| `within` | `Boolean` | ... |
| `intersects` | `Boolean` | ... |
| `contains` | `Boolean` | ... |

### Point
A JavaScript object representing a (GeoJSON Point)[].

#### Constructor
`Terraformer.Point` can be created by passing a [GeoJSON Coordinate]() like `[longitude, latitude]`, with plain `x,y`, or a valid [GeoJSON Point]().

```js
var point1 = new Terraformer.Point({
  type:"Point", 
  coordinates:[1,2]
});

var point2 = new Terraformer.Point(1,2);

var point3 = new Terraformer.Point([1,2]);
```

### MultiPoint
A JavaScript object representing a (GeoJSON MultiPoint)[].

#### Constructor
``

#### Methods
| Method | Returns | Description
| --- | --- | --- |
| `forEach`| `null` | ... |
| `get` | `Point` | ... |
| `addPoint` | this | ... |
| `insertPoint` | this | ... |
| `removePoint` | this | ... |

### LineString
A JavaScript object representing a (GeoJSON LineString)[].

#### Constructor

#### Methods
| Method | Returns | Description
| --- | --- | --- |
| `addVertex` | this | ... |
| `insertVertex` | this | ... |
| `removeVertex` | this | ... |



### MultiLineString
A JavaScript object representing a (GeoJSON MultiLineString)[].

#### Constructor

#### Methods
| Method | Returns | Description
| --- | --- | --- |
| `get` | `Polygon` | ... |

### Polygon
A JavaScript object representing a (GeoJSON Polygon)[].

#### Constructor

#### Methods
| --- | --- | --- |
| `addVertex` | this | ... |
| `insertVertex` | this | ... |
| `removeVertex` | this | ... |
| `close` | this | ... |

### MultiPolygon
A JavaScript object representing a (GeoJSON MultiPolygon)[].

#### Constructor

#### Methods
| Method | Returns | Description
| --- | --- | --- |
| `forEach`| null | ... |
| `get` | `Polygon` | ... |

### Feature

### FeatureCollection
A JavaScript object representing a (GeoJSON FeatureCollection)[].

#### Constructor

#### Methods
| Method | Returns | Description
| --- | --- | --- |
| `forEach`| null | ... |
| `get` | `Feature` | ... |

### GeometryCollection
A JavaScript object representing a (GeoJSON GeometryCollection)[].

#### Constructor

#### Methods
| Method | Returns | Description |
| --- | --- | --- |
| `forEach`| null | ... |
| `get` | `GeoJSON` | ... |

### Circle
The GeoJSON spec does not provide a way to visualize circles. `Terraformer.Circle` is actual a [GeoJSON Feature]() ojbect that contains a Polygon representing a circle with a certain number of sides.

#### Constructor
`Terraformer.Circle` is created with a `center`, `radius`, and `steps`.

| Option | Type | Default | Description
| --- | --- | --- | --- |
| `center` | `Coordinate` | null | **Required** ... |
| `radius` | `Number` | 250 | ... |
| `interpolate` | `Number` | 32 | ... |

```js
circle = new Terraformer.Circle([45.65, -122.27], 500, 64);

circle.contains(point);
```

#### Methods
| Method | Returns | Description
| --- | --- | --- |
| `recalculate` | this | ... |
| `steps` | `Number` | ... |
| `radius` | `Number` | ... |
| `center` | `Coordinates` | ... |

## Tools
Terraformer also has numerous helper methods for working with GeoJSON and geographic data.

### Spatial Reference Conversions
| Method | Returns | Description |
| --- | --- | --- |
| `toMercator(geojson)` | `GeoJSON` | ... |
| `toGeographic(geojson)` | `GeoJSON` | ... |
| `applyConverter(geojson, function)` | `GeoJSON` | ... |
| `positionToMercator(coordinate)` | `Coordinate` | ... |
| `positionToGeographic(coordinate)` | `Coordinate` | ... |

### Calculations
| Method | Returns | Description |
| --- | --- | --- |
| `calculateBounds` | `Array` | ... |
| `calculateEnvelope` | `Object` | ... |
| `convexHull` | `Polygon` | ... |

### Comparisons
| Method | Returns | Description |
| --- | --- | --- |
| `coordinatesContainPoint` | `Boolean` | ... |
| `polygonContainsPoint` | `Boolean` | ... |
| `arrayIntersectsArray` | `Boolean` | ... |
| `coordinatesContainPoint` | `Boolean` | ... |
| `coordinatesEqual` | `Boolean` | ... |
