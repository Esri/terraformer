/**
 * Terraformer module
 * @example
 * import * as Terraformer from "terraformer";
 */

import * as GeoJSON from 'geojson'

// Note: Terraformer module exports namespace so it can be augmented by
// terraformer-wkt-parser and potentially others
export as namespace Terraformer;

// Export Terraformer for AMD require
export = Terraformer;

declare namespace Terraformer {
    export interface Envelope {
        x: number;
        y: number;
        w: number;
        h: number;
    }
    export type BBox = number[]; // [number, number, number, number]

    export type Coordinate = GeoJSON.Position;
    export type Coordinates = GeoJSON.Position[];

    /**
    * Terraformer Primitives are JavaScript objects that map directly to their GeoJSON couterparts.
    * Converting a GeoJSON object into a Terraformer Primitive will allow you use convenience methods like
    * point.within(polygon).
    *
    * Every Primitive inherits from the Terraformer.Primitive base class, thus all other Primitives share the
    * Terraformer.Primitive methods.
    *
    * There is a Primitive for every type of GeoJSON object, plus a Circle Primitive which represents a circle as a
    * polygon.
    */
    export class Primitive<T extends GeoJSON.GeoJsonObject> implements GeoJSON.GeoJsonObject {
        public type: GeoJSON.GeoJsonTypes;
        /**
        * You create a new Terraformer.Primitive object by passing it a valid GeoJSON Object. This will return a
        * Terraformer.Primitive with the same type as your GeoJSON object.
        * @param geojson GeoJSON Primitive
        */
        constructor(geojson: T);
        /**
        * Converts this GeoJSON object’s coordinates to the web mercator spatial reference.
        */
        public toMercator(): this;
        /**
        * Converts this GeoJSON object’s coordinates to geographic coordinates.
        */
        public toGeographic(): this;
        /**
        * Returns an object with x, y, w and h suitable for passing to most indexes.
        */
        public envelope(): Envelope;
        // /**
        //  * Returns the GeoJSON Bounding Box for this primitive.
        //  */
        // bbox(): number[]; // Terraformer docs have this function, but conflicts with GeoJSON typescript definitions for
        //                   // optional bbox property.
        /**
        * Returns the convex hull of this primitive as a Polygon. Will return null if the convex hull cannot be calculated
        * or a valid Polygon cannot be created.
        */
        public convexHull(): GeoJSON.Polygon | null;
        /**
        * Returns true if the passed GeoJSON Geometry object is completely contained inside this primitive.
        * @param geometry The geometry that potentially is inside of this one.
        * @returns Returns true if the passed GeoJSON Geometry object is completely contained inside this primitive.
        */
        public contains(geometry: GeoJSON.GeometryObject): boolean;
        /**
        * Returns true if the passed GeoJSON Geometry object is completely within this primitive.
        * @param geometry GeoJSON geometry
        */
        public within(geometry: GeoJSON.GeometryObject): boolean;
        /**
        * Returns true if the passed GeoJSON Geometry intersects this primitive.
        * @param geometry GeoJSON geometry
        */
        public intersects(geometry: GeoJSON.GeometryObject): boolean;
    }

    export class Point extends Primitive<GeoJSON.Point> implements GeoJSON.Point {
        public type: "Point";
        public coordinates: GeoJSON.Position;
        constructor(p: GeoJSON.Point);
        constructor(x: number, y: number);
        constructor(xy: GeoJSON.Position);
    }

    export class MultiPoint extends Primitive<GeoJSON.MultiPoint> implements GeoJSON.MultiPoint {
        public type: "MultiPoint";
        public coordinates: GeoJSON.Position[];
        public forEach: (point: Point, index: number, coordinates: Coordinates) => null;
        constructor(geojsonMP: GeoJSON.MultiPoint);
        constructor(coordinates: Coordinates);
        public get(index: number): Point;
        public addPoint(coordinate: Coordinate): this;
        public insertPoint(coordinate: Coordinate, index: number): this;
        public removePoint(index: number): this;
        public removePoint(coordinate: Coordinate): this;
    }

    export class LineString extends Primitive<GeoJSON.LineString> implements GeoJSON.LineString {
        public type: "LineString";
        public coordinates: GeoJSON.Position[];
        constructor(geoJson: GeoJSON.LineString);
        constructor(coordinates: Coordinates);
        public addVertex(coordinate: Coordinate): this;
        public insertVertex(coordinate: Coordinate, index: number): this;
        public removeVertex(index: number): this;
    }

    export class MultiLineString extends Primitive<GeoJSON.MultiLineString> implements GeoJSON.MultiLineString {
        public type: "MultiLineString";
        public coordinates: Coordinate[][];
        public forEach: (linestring: LineString, index: number, coordinates: Coordinates) => null;
        constructor(geoJson: GeoJSON.MultiLineString);
        constructor(coordinates: Coordinates[]);
        public get(index: number): LineString
    }

    export class Polygon extends Primitive<GeoJSON.Polygon> implements GeoJSON.Polygon {
        public type: "Polygon";
        public coordinates: Coordinate[][];
        constructor(geoJson: GeoJSON.Polygon);
        constructor(coordinates: Coordinates[])
        public addVertex(coordinate: Coordinate): this;
        public insertVertex(coordinate: Coordinate, index: number): this;
        public removeVertex(index: number): this;
        public close(): this;
        public hasHoles(): boolean;
        public holes(): Polygon[]
    }

    export class MultiPolygon extends Primitive<GeoJSON.MultiPolygon> implements GeoJSON.MultiPolygon {
        public type: "MultiPolygon";
        public coordinates: Coordinates[][];
        public forEach: (polygon: Polygon, index: number, coordinates: Coordinates) => null;
        constructor(geoJson: GeoJSON.Polygon);
        constructor(geoJson: GeoJSON.MultiPolygon);
        // // Valid, according to http://terraformer.io/core/#constructor-6
        // constructor(geoJson:{
        //     type: "MultiPolygon",
        //     coordinates: number[][][]
        // });
        constructor(coordinates: Coordinates[]);
        constructor(coordinates: Coordinates[][]);
        public get(index: number): Polygon
    }

    export class Feature<T extends GeoJSON.GeometryObject> implements GeoJSON.Feature<T> {
        public type: "Feature";
        public geometry: T;
        public properties: any;
        constructor(geometry: T);
        constructor(geoJson: GeoJSON.Feature<T>);
    }

    export class FeatureCollection<T extends GeoJSON.GeometryObject> implements GeoJSON.FeatureCollection<T> {
        public type: "FeatureCollection";
        public features: Array<GeoJSON.Feature<T>>;
        public forEach: (feature: Feature<T>, index: number, coordinates: Coordinates) => null;
        constructor(geoJson: GeoJSON.FeatureCollection<T>);
        constructor(features: Array<GeoJSON.Feature<T>>);
        public get(index: number): Feature<T>
    }

    export class GeometryCollection implements GeoJSON.GeometryCollection {
        public type: "GeometryCollection";
        public geometries: GeoJSON.GeometryObject[];
        public forEach: (geometry: GeoJSON.GeometryObject, index: number, coordinates: Coordinates) => null;
        constructor(geoJson: GeoJSON.GeometryCollection);
        constructor(geoJson: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>);
        constructor(features: GeoJSON.GeometryObject[]);
        public get(index: number): Primitive<GeoJSON.GeometryObject>
    }

    /**
    * The GeoJSON spec does not provide a way to visualize circles.
    * Terraformer.Circle is actual a GeoJSON Feature object that contains a Polygon representing a circle with a certain number of sides.
    * @example
    * circle = new Terraformer.Circle([-122.27, 45.65], 500, 64);
    *
    * circle.contains(point);
    */
    export class Circle extends Primitive<GeoJSON.Feature<GeoJSON.Polygon>> implements GeoJSON.Feature<GeoJSON.Polygon> {
        public type: "Feature";
        public geometry: GeoJSON.Polygon;
        public properties: any;
        public steps: (steps?: number) => number;
        /**
        * Returns the radius circle. If the radius parameter is passed the circle will be recalculated witht he new radius before returning.
        */
        public radius: (radius?: number) => number;
        /**
        * Returns the center of the circle. If the center parameter is passed the circle will be recalculated with the new center before returning.
        */
        public center: (center?: Coordinate) => Coordinates;
        /**
        * Terraformer.Circle is created with a center, radius, and steps.
        * @param [center=null] Required A GeoJSON Coordinate in [x,y] format.
        * @param [radius=250] The radius of the circle in meters.
        * @param [steps=32] How many steps will be used to create the polygon that represents the circle.
        */
        constructor(center: Coordinate, radius?: number, steps?: number);
        /**
        * Recalculates the circle
        */
        public recalculate(): this;
        /**
        * Returns the number of steps to produce the polygon representing the circle. If the steps parameter is passed the circle will be recalculated witht he new step count before returning.
        */
    }

    /**
    * Terraformer also has numerous helper methods for working with GeoJSON and geographic data.
    * These tools work with a mix of lower level GeoJSON constructs like Coordinates,
    * Coordinate Arrays and GeoJSON objects and Terraformer Primitives
    */
    export class Tools {
        // Spatial Reference Conversions
        /**
        * Converts this GeoJSON object’s coordinates to the web mercator spatial reference. This is an in-place modification of the passed object.
        * @param geojson GeoJSON object
        */
        public static toMercator(geojson: GeoJSON.GeoJsonObject): GeoJSON.GeoJsonObject;
        /**
        * Converts this GeoJSON object’s coordinates to geographic coordinates. This is an in-place modification of the passed object.
        * @param geojson GeoJSON object
        */
        public static toGeographic(geojson: GeoJSON.GeoJsonObject): GeoJSON.GeoJsonObject;
        /**
        * Runs the passed function against every Coordinate in the geojson object. Your function will be passed a Coordinate and will be expected to return a Coordinate.
        * @param geojson GeoJSON object
        * @param converter Function to convert one coordinate to a different coordinate.
        */
        public static applyConverter(geojson: GeoJSON.GeoJsonObject, converter: (coordinate: Coordinate) => Coordinate): GeoJSON.GeoJsonObject;
        /**
        * Converts the passed Coordinate to web mercator spatial reference.
        * @param coordinate Coordinate
        */
        public static positionToMercator(coordinate: Coordinate): Coordinate;
        /**
        * Converts the passed Coordinate to geographic coordinates.
        * @param coordinate Coordinate to convert
        */
        public static positionToGeographic(coordinate: Coordinate): Coordinate;

        // Calculations

        /**
        * Returns a GeoJSON bounding box for the passed geoJSON.
        * @param geojson
        */
        public static calculateBounds(geojson: GeoJSON.GeoJsonObject): BBox;
        /**
        * Returns an object with x, y, w, h. Suitable for passing to most indexes.
        * @param geojson
        */
        public static calculateEnvelope(geojson: GeoJSON.GeoJsonObject): Envelope;
        /**
        * Returns an array of coordinates representing the convex hull the the passed geoJSON.
        * @param geojson
        */
        public static convexHull(geojson: Coordinates): Coordinates;

        // Comparisons

        /**
        * Accepts an array of coordinates and a coordinate and returns true if the point falls within the coordinate array.
        * @param coordinates Array of coordinates
        * @param coordinate Coordinate that will be searched for in the array.
        */
        public static coordinatesContainPoint(coordinates: Coordinates[], coordinate: Coordinate): Boolean;
        /**
        * Accepts the geometry of a polygon and a coordinate and returns true if the point falls within the polygon.
        * @param polygon
        * @param coordinate
        */
        public static polygonContainsPoint(polygon: GeoJSON.Polygon, coordinate: Coordinate): Boolean;
        /**
        * Accepts the geometry of a polygon and a coordinate and returns true if the point falls within the polygon.
        * @param polygon
        * @param coordinate
        */
        public static polygonContainsPoint(polygon: GeoJSON.Position[][], coordinate: Coordinate): Boolean;
        /**
        * Accepts two arrays of coordinates and returns true if they cross each other at any point.
        * @param c1
        * @param c2
        * @example
        * var pt = [0,0];
        * var pt2 = [-111.873779, 40.647303];
        *
        * var polygon = {
        * "type": "Polygon",
        * "coordinates": [[
        *     [-112.074279, 40.52215],
        *     [-112.074279, 40.853293],
        *     [-111.610107, 40.853293],
        *     [-111.610107, 40.52215],
        *     [-112.074279, 40.52215]
        * ]]
        * };
        *
        * var polygonGeometry = polygon.coordinates;
        *
        * Terraformer.Tools.polygonContainsPoint(polygonGeometry, pt);
        * // returns false
        * Terraformer.Tools.polygonContainsPoint(polygonGeometry, pt2);
        * // returns true
        */
        public static arrayIntersectsArray(c1: Coordinates[], c2: Coordinates[]): Boolean;
        /**
        * Accepts two individual coordinate pairs and returns true if the passed coordinate pairs are equal to each other.
        * @param c1
        * @param c2
        */
        public static coordinatesEqual(c1: Coordinate, c2: Coordinate): Boolean;
    }
}
