# Terraformer Core

## Primitives
The Terraformer Primitives are classes that map directly to their GeoJSON equivalents, adding convenience methods, geometric tools such as `within`, and `intersects` and spatial reference conversion methods.

* Primitive
* Point
* MultiPoint
* LineString
* MultiLineString
* Polygon
* MultiPolygon
* FeatureCollection
* GeometryCollection
* Circle

## Tools
Terraformer also exposes many generic tools for working with geographic data.

* toMercator
* toGeographic
* positionToMercator
* positionToGeographic
* applyConverter
* toMercator
* toGeographic
* createCircle
* calculateBounds
* calculateEnvelope
* coordinatesContainPoint
* polygonContainsPoint
* arrayIntersectsArray
* coordinatesContainPoint
* coordinatesEqual
* convexHull