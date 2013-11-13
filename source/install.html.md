---
title: Installing Terraformer
layout: documentation
---

# Getting Terraformer

<!-- table_of_contents -->

We make Terraformer available via a number of distribution methods including [NPM](#npm), [Bower](#bower) and a [CDN](#cdn)

## Node.js

All the parts of the Terraformer project are published on NPM. [Terraformer on NPM](https://npmjs.org/search?q=terraformer-*)

**Core Terraformer Module**

```
$ npm install terraformer
```

**ArcGIS Parser**

```
$ npm install terraformer-arcgis-parser
```

**WKT Parser**

```
$ npm install terraformer-wkt-parser
```

**GeoStore**

```
npm install terraformer-geostore
```

**Indexes**

```
npm install terraformer-rtree
```

**Backing Stores**

```
npm install terraformer-geostore-memory
npm install terraformer-geostore-leveldb
```

## CDN 

You can grab the latest released version of all Terraformer modules from webgeo.io CDN. If you need https support replace `http://cdn.webgeo.io` with `https://cdn-geoweb.s3.amazonaws.com`.

```html
<!-- Core Terraformer Module -->
<script src="http://cdn.webgeo.io/terraformer/1.0.1/terraformer.min.js"></script>

<!-- ArcGIS Parser -->
<script src="http://cdn.webgeo.io/terraformer-arcgis-parser/1.0.0/terraformer-arcgis-parser.min.js"></script>

<!-- WKT Parser -->
<script src="http://cdn.webgeo.io/terraformer-wkt-parser/1.0.0/terraformer-wkt-parser.min.js"></script>

<!-- GeoStore -->
<script src="http://cdn.webgeo.io/terraformer-geostore/1.0.1/terraformer-geostore.min.js"></script>

<!-- RTree index for GeoStore -->
<script src="http://cdn.webgeo.io/terraformer-rtree/1.0.0/terraformer-rtree.min.js"></script>

<!-- In memory backing for GeoStore -->
<script src="http://cdn.webgeo.io/terraformer-geostore-memory/1.0.0/terraformer-geostore-memory.min.js"></script>

<!-- Localstorage backing for GeoStore -->
<script src="http://cdn.webgeo.io/terraformer-geostore-localstorage/1.0.0/terraformer-geostore-localstorage.min.js"></script>
```

## Bower

All the parts of the Terraformer project are published on Bower. [Terraformer on Bower](http://sindresorhus.com/bower-components/#!/search/terraformer)

**Core Terraformer Module**

```
$ bower install terraformer
```

**ArcGIS Parser**

```
$ bower install terraformer-arcgis-parser
```

**WKT Parser**

```
$ bower install terraformer-wkt-parser
```

**GeoStore**

```
bower install terraformer-geostore
```

**Indexes**

```
bower install terraformer-rtree
```

**Backing Stores**

```
bower install terraformer-geostore-memory
bower install terraformer-geostore-localstorage
```