# Terraformer

Terraformer is a modular toolkit for working with geographic data.

## Modules

The Terraformer project to broken up into a series of smaller modules.

* [Terraformer Core](http://terraformer.io/core/) - Contains methods and objects for working with GeoJSON. This also contains common methods used by other modules.
* [WKT Parser](http://terraformer.io/wkt-parser/) - Parse Well Known Text into GeoJSON and vica-versa.
* [ArcGIS Geometry Parser](http://terraformer.io/arcgis-parser/) - Parse the [ArcGIS Geometry Format](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/) into GeoJSON and vica-versa.
* [GeoStore](http://terraformer.io/geostore/) - A framework for persisting and querying GeoJSON features with pluggable indexes and persistant stores.

## Features

* Designed to work in Node and the browser
* No dependancies of other tools or libraries

## Getting Started

Check out the getting [started guide](http://terraformer.io/getting-started/) which will give you an overview of core concepts and methods in Terraformer.

## Examples

Coming Soon!

## Resources

* [Terraformer Website](http://terraformer.io)
* [twitter@EsriPDX](http://twitter.com/esripdx)

## Building the documentation

To build the site locally, first `bundle install` then `bundle exec middleman` to run a local server. Once you're satisfied, run `bundle exec middleman build`, then `grunt gh-pages` to deploy to github pages.

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

[](Esri Tags: Terraformer GeoJSON)
[](Esri Language: JavaScript)
