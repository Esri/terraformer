# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [unreleased]

## [1.0.6] - 2016-08-17

### Added
* typings for TypeScript folks (thx [@JeffJacobson](https://github.com/JeffJacobson)) [#20](https://github.com/Esri/terraformer-wkt-parser/pull/20)
* lots of little website improvements

## [1.0.5] - 2015-03-14

### Changed

* Use Jarvis March for convex hulls

## [1.0.4] - 2014-08-06

### Fixed

* Internal improvements to `addVertex()` and `arrayIntersectsArrays`

### Added

* new `isConvex()` method

## [1.0.3] - 2014-02-24

### Fixed

* MultiPolygons can now be closed with the `multipolygon.close()` method.
* Circles are now closed properly [#234](https://github.com/Esri/Terraformer/pull/234)

## [1.0.2] - 2013-12-16

This release fixes several issues related to convexHull and ensures the Polygons are closed under a variety of situations.

### Breaking Changes

primitive.convexHull() now always returns null or a valid Terraformer.Polygon. It will not return arrays or throw errors.

### Fixed

* `Terraformer.Circle` is now closed.
* `Polygon`s returned by `primitive.convexHull()` are now closed.

### Added

* `primitive.convexHull()`` will now handle features.

## [1.0.1] - 2013-11-12

Initial Release

[unreleased]: https://github.com/Esri/Terraformer/compare/v1.0.6...HEAD
[1.0.6]: https://github.com/Esri/Terraformer/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/Esri/Terraformer/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/Esri/Terraformer/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/Esri/Terraformer/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/Esri/Terraformer/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Esri/Terraformer/releases/tag/v1.0.1
