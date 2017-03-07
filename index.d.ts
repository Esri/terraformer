/**
 * Terraformer module
 * @example
 * import * as Terraformer from "terraformer";
 */

export interface Envelope {
    x: number,
    y: number,
    w: number,
    h: number
}
export type BBox = number[]; //[number, number, number, number]

export type Coordinate = GeoJSON.Position
export type Coordinates = GeoJSON.Position[];

/**
 * Terraformer Primitives are JavaScript objects that map directly to their GeoJSON couterparts. Converting a GeoJSON object into a Terraformer Primitive will allow you use convenience methods like point.within(polygon).
 *
 * Every Primitive inherits from the Terraformer.Primitive base class, thus all other Primitives share the Terraformer.Primitive methods.
 *
 * There is a Primitive for every type of GeoJSON object, plus a Circle Primitive which represents a circle as a polygon.
 */
export class Primitive<T extends GeoJSON.GeoJsonObject> implements GeoJSON.GeoJsonObject {
    /**
     * You create a new Terraformer.Primitive object by passing it a valid GeoJSON Object. This will return a Terraformer.Primitive with the same type as your GeoJSON object.
     * @param geojson GeoJSON Primitive
     */
    constructor(geojson: T);
    type: string;
    /**
     * Converts this GeoJSON object’s coordinates to the web mercator spatial reference.
     */
    toMercator(): this;
    /**
     * Converts this GeoJSON object’s coordinates to geographic coordinates.
     */
    toGeographic(): this;
    /**
     * Returns an object with x, y, w and h suitable for passing to most indexes.
     */
    envelope(): Envelope;
    // /**
    //  * Returns the GeoJSON Bounding Box for this primitive.
    //  */
    // bbox(): number[]; // Terraformer docs have this function, but conflicts with GeoJSON typescript definitions for optional bbox property.
    /**
     * Returns the convex hull of this primitive as a Polygon. Will return null if the convex hull cannot be calculated or a valid Polygon cannot be created.
     */
    convexHull(): GeoJSON.Polygon | null;
    /**
     * Returns true if the passed GeoJSON Geometry object is completely contained inside this primitive.
     * @param geometry The geometry that potentially is inside of this one.
     * @returns Returns true if the passed GeoJSON Geometry object is completely contained inside this primitive.
     */
    contains(geometry: GeoJSON.GeometryObject): boolean;
    /**
     * Returns true if the passed GeoJSON Geometry object is completely within this primitive.
     * @param geometry GeoJSON geometry
     */
    within(geometry: GeoJSON.GeometryObject): boolean;
    /**
     * Returns true if the passed GeoJSON Geometry intersects this primitive.
     * @param geometry GeoJSON geometry
     */
    intersects(geometry: GeoJSON.GeometryObject): boolean;
}

export class Point extends Primitive<GeoJSON.Point> implements GeoJSON.Point {
    constructor(p: GeoJSON.Point);
    constructor(x: number, y: number);
    constructor(xy: GeoJSON.Position);
    type: "Point";
    coordinates: GeoJSON.Position;
}

export class MultiPoint extends Primitive<GeoJSON.MultiPoint> implements GeoJSON.MultiPoint {
    constructor(geojsonMP: GeoJSON.MultiPoint);
    constructor(coordinates: Coordinates);
    type: "MultiPoint";
    coordinates: GeoJSON.Position[];
    forEach: (point: Point, index: number, coordinates: Coordinates) => null;
    get(index: number): Point;
    addPoint(coordinate: Coordinate): this;
    insertPoint(coordinate: Coordinate, index: number): this;
    removePoint(index: number): this;
    removePoint(coordinate: Coordinate): this;
}

export class LineString extends Primitive<GeoJSON.LineString> implements GeoJSON.LineString {
    constructor(geoJson: GeoJSON.LineString);
    constructor(coordinates: Coordinates);
    type: "LineString";
    coordinates: GeoJSON.Position[];
    addVertex(coordinate: Coordinate): this;
    insertVertex(coordinate: Coordinate, index: number): this;
    removeVertex(index: number): this;
}

export class MultiLineString extends Primitive<GeoJSON.MultiLineString> implements GeoJSON.MultiLineString {
    constructor(geoJson: GeoJSON.MultiLineString);
    constructor(coordinates: Coordinates[]);
    type: "MultiLineString";
    coordinates: Coordinate[][];
    forEach: (linestring: LineString, index: number, coordinates: Coordinates) => null;
    get(index: number): LineString
}

export class Polygon extends Primitive<GeoJSON.Polygon> implements GeoJSON.Polygon {
    constructor(geoJson: GeoJSON.Polygon);
    constructor(coordinates: Coordinates[])
    type: "Polygon";
    coordinates: Coordinate[][];
    addVertex(coordinate: Coordinate): this;
    insertVertex(coordinate: Coordinate, index: number): this;
    removeVertex(index: number): this;
    close(): this;
    hasHoles(): boolean;
    holes(): Polygon[]
}

export class MultiPolygon extends Primitive<GeoJSON.MultiPolygon> implements GeoJSON.MultiPolygon {
    constructor(geoJson: GeoJSON.Polygon);
    constructor(geoJson: GeoJSON.MultiPolygon);
    // // Valid, according to http://terraformer.io/core/#constructor-6
    // constructor(geoJson:{
    //     type: "MultiPolygon",
    //     coordinates: number[][][]
    // });
    constructor(coordinates: Coordinates[]);
    constructor(coordinates: Coordinates[][]);
    type: "MultiPolygon";
    coordinates: Coordinates[][];
    forEach: (polygon: Polygon, index: number, coordinates: Coordinates) => null;
    get(index: number): Polygon
}

export class Feature<T extends GeoJSON.GeometryObject> implements GeoJSON.Feature<T> {
    type: "Feature";
    geometry: T
    properties: any;
    constructor(geometry: T);
    constructor(geoJson: GeoJSON.Feature<T>);
}

export class FeatureCollection<T extends GeoJSON.GeometryObject> implements GeoJSON.FeatureCollection<T> {
    type: "FeatureCollection";
    features: GeoJSON.Feature<T>[];
    constructor(geoJson: GeoJSON.FeatureCollection<T>);
    constructor(features: GeoJSON.Feature<T>[]);
    forEach: (feature: Feature<T>, index: number, coordinates: Coordinates) => null;
    get(index: number): Feature<T>
}

export class GeometryCollection implements GeoJSON.GeometryCollection {
    type: "GeometryCollection";
    geometries: GeoJSON.GeometryObject[];
    constructor(geoJson: GeoJSON.GeometryCollection);
    constructor(geoJson: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>);
    constructor(features: GeoJSON.GeometryObject[]);
    forEach: (geometry: GeoJSON.GeometryObject, index: number, coordinates: Coordinates) => null;
    get(index: number): Primitive<GeoJSON.GeometryObject>
}

/**
 * The GeoJSON spec does not provide a way to visualize circles.
 * Terraformer.Circle is actual a GeoJSON Feature object that contains a Polygon representing a circle with a certain number of sides.
 * @example
 * circle = new Terraformer.Circle([45.65, -122.27], 500, 64);
 *
 * circle.contains(point);
 */
export class Circle extends Primitive<GeoJSON.Feature<GeoJSON.Polygon>> implements GeoJSON.Feature<GeoJSON.Polygon> {
    type: "Feature";
    geometry: GeoJSON.Polygon;
    properties: any;
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
    recalculate(): this;
    /**
     * Returns the number of steps to produce the polygon representing the circle. If the steps parameter is passed the circle will be recalculated witht he new step count before returning.
     */
    steps: (steps?: number) => number;
    /**
     * Returns the radius circle. If the radius parameter is passed the circle will be recalculated witht he new radius before returning.
     */
    radius: (radius?: number) => number;
    /**
     * Returns the center of the circle. If the center parameter is passed the circle will be recalculated with the new center before returning.
     */
    center: (center?: Coordinate) => Coordinates;
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
    static toMercator(geojson: GeoJSON.GeoJsonObject): GeoJSON.GeoJsonObject;
    /**
     * Converts this GeoJSON object’s coordinates to geographic coordinates. This is an in-place modification of the passed object.
     * @param geojson GeoJSON object
     */
    static toGeographic(geojson: GeoJSON.GeoJsonObject): GeoJSON.GeoJsonObject;
    /**
     * Runs the passed function against every Coordinate in the geojson object. Your function will be passed a Coordinate and will be expected to return a Coordinate.
     * @param geojson GeoJSON object
     * @param converter Function to convert one coordinate to a different coordinate.
     */
    static applyConverter(geojson: GeoJSON.GeoJsonObject, converter: (coordinate: Coordinate) => Coordinate): GeoJSON.GeoJsonObject;
    /**
     * Converts the passed Coordinate to web mercator spatial reference.
     * @param coordinate Coordinate
     */
    static positionToMercator(coordinate: Coordinate): Coordinate;
    /**
     * Converts the passed Coordinate to geographic coordinates.
     * @param coordinate Coordinate to convert
     */
    static positionToGeographic(coordinate: Coordinate): Coordinate;

    // Calculations

    /**
     * Returns a GeoJSON bounding box for the passed geoJSON.
     * @param geojson
     */
    static calculateBounds(geojson: GeoJSON.GeoJsonObject): BBox;
    /**
     * Returns an object with x, y, w, h. Suitable for passing to most indexes.
     * @param geojson
     */
    static calculateEnvelope(geojson: GeoJSON.GeoJsonObject): Envelope;
    /**
     * Returns an array of coordinates representing the convex hull the the passed geoJSON.
     * @param geojson
     */
    static convexHull(geojson: Coordinates): Coordinates;

    // Comparisons

    /**
     * Accepts an array of coordinates and a coordinate and returns true if the point falls within the coordinate array.
     * @param coordinates Array of coordinates
     * @param coordinate Coordinate that will be searched for in the array.
     */
    static coordinatesContainPoint(coordinates: Coordinates[], coordinate: Coordinate): Boolean;
    /**
     * Accepts the geometry of a polygon and a coordinate and returns true if the point falls within the polygon.
     * @param polygon
     * @param coordinate
     */
    static polygonContainsPoint(polygon: GeoJSON.Polygon, coordinate: Coordinate): Boolean;
    /**
     * Accepts the geometry of a polygon and a coordinate and returns true if the point falls within the polygon.
     * @param polygon
     * @param coordinate
     */
    static polygonContainsPoint(polygon: GeoJSON.Position[][], coordinate: Coordinate): Boolean;
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
    static arrayIntersectsArray(c1: Coordinates[], c2: Coordinates[]): Boolean;
    /**
     * Accepts two individual coordinate pairs and returns true if the passed coordinate pairs are equal to each other.
     * @param c1
     * @param c2
     */
    static coordinatesEqual(c1: Coordinate, c2: Coordinate): Boolean;
}
