---
title: Core Concepts
layout: documentation
---

# GeoStore Core Concepts

The GeoStore is a spatial database builder.  With the GeoStore, you can store your data, index it, and search it.

## Indexing

Indexes are key to GeoStore performance.  The GeoStore uses indexes to look up potential candidates during a search.

### Geospatial Indexes

Each GeoStore instance requires a Geospatial index (like RTree).  These indexes allow for a quick search of possible data that could be `within` or `contain` the polygon that you pass in to the GeoStore for a search.  It is then later up to math to determine whether the correct data is found.

### Alternate Indexes

A GeoStore can also have one or more alternate indexes associated with it.  These allow for other properties of a Feature to be indexed, such as `Crime` or `Year` in order to quickly remove the data from being checked with math.

## Storing of the Data

Data in a GeoStore can be stored in multiple ways.  These Stores can be local, a database, or remote.  As long as they conform to the data store model, it does not matter how or where the data is stored.
