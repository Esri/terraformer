declare namespace Terraformer {
    interface Envelope {
        x: number,
        y: number,
        w: number,
        h: number
    }
    type BBox = number[]; //[number, number, number, number]

    type Coordinate = GeoJSON.Position
    type Coordinates = GeoJSON.Position[];

    class Primitive<T extends GeoJSON.GeoJsonObject> implements GeoJSON.GeoJsonObject {
        constructor(geojson: T);
        type: string;
        toMercator(): this;
        toGeographic(): this;
        envelope(): Envelope;
        // bbox(): number[]; // Terraformer docs have this function, but conflicts with GeoJSON typescript definitions for optional bbox property.
        convexHull(): GeoJSON.Polygon;
        contains(geometry: GeoJSON.GeometryObject): boolean;
        within(geometry: GeoJSON.GeometryObject): boolean;
        intersects(geometry: GeoJSON.GeometryObject): boolean;
    }

    class Point extends Primitive<GeoJSON.Point> implements GeoJSON.Point {
        constructor(p: GeoJSON.Point);
        constructor(x: number, y: number);
        constructor(xy: GeoJSON.Position);
        type: "Point";
        coordinates: GeoJSON.Position;
    }

    class MultiPoint extends Primitive<GeoJSON.MultiPoint> implements GeoJSON.MultiPoint {
        constructor(geojsonMP: GeoJSON.MultiPoint);
        constructor(coordinates: Coordinates);
        type: "MultiPoint";
        coordinates: GeoJSON.Position[];
        forEach(f: Function);
        get(index: number): Point;
        addPoint(coordinate: Coordinate): this;
        insertPoint(coordinate: Coordinate, index: number): this;
        removePoint(index: number): this;
        removePoint(coordinate: Coordinate): this;
    }

    class LineString extends Primitive<GeoJSON.LineString> implements GeoJSON.LineString {
        constructor(geoJson: GeoJSON.LineString);
        constructor(coordinates: Coordinates);
        type: "LineString";
        coordinates: GeoJSON.Position[];
        addVertex(coordinate: Coordinate): this;
        insertVertex(coordinate: Coordinate, index: number): this;
        removeVertex(index: number): this;
    }

    class MultiLineString extends Primitive<GeoJSON.MultiLineString> implements GeoJSON.MultiLineString {
        constructor(geoJson: GeoJSON.MultiLineString);
        constructor(coordinates: Coordinates[]);
        type: "MultiLineString";
        coordinates: Coordinate[][];
        forEach(f: Function)
        get(index: number): LineString
    }

    class Polygon extends Primitive<GeoJSON.Polygon> implements GeoJSON.Polygon {
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

    class MultiPolygon extends Primitive<GeoJSON.MultiPolygon> implements GeoJSON.MultiPolygon {
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
        forEach(f: Function)
        get(index: number): Polygon
    }

    class Feature<T extends GeoJSON.GeometryObject> implements GeoJSON.Feature<T> {
        type: "Feature";
        geometry: T
        properties: any;
        constructor(geometry: T);
        constructor(geoJson: GeoJSON.Feature<T>);
    }

    class FeatureCollection<T extends GeoJSON.GeometryObject> implements GeoJSON.FeatureCollection<T> {
        type: "FeatureCollection";
        features: GeoJSON.Feature<T>[];
        constructor(geoJson: GeoJSON.FeatureCollection<T>);
        constructor(features: GeoJSON.Feature<T>[]);
        forEach(f: Function)
        get(index: number): Feature<T>
    }

    class GeometryCollection implements GeoJSON.GeometryCollection {
        type: "GeometryCollection";
        geometries: GeoJSON.GeometryObject[];
        constructor(geoJson: GeoJSON.GeometryCollection);
        constructor(geoJson: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>);
        constructor(features: GeoJSON.GeometryObject[]);
        forEach(f: Function)
        get(index: number): Primitive<GeoJSON.GeometryObject>
    }

    class Circle extends Primitive<GeoJSON.Feature<GeoJSON.Polygon>> implements GeoJSON.Feature<GeoJSON.Polygon> {
        type: "Feature";
        geometry: GeoJSON.Polygon;
        properties: any;
        constructor(center: Coordinate, radius: number, steps: number);
        recalculate(): this;
        steps(steps?: number);
        radius(radius?: number);
        center(center?: Coordinate);
    }

    class Tools {
        // Spatial Reference Conversions

        static toMercator(geojson: GeoJSON.GeoJsonObject): GeoJSON.GeoJsonObject;
        static toGeographic(geojson: GeoJSON.GeoJsonObject): GeoJSON.GeoJsonObject;
        static applyConverter(geojson: GeoJSON.GeoJsonObject): GeoJSON.GeoJsonObject;
        static positionToMercator(coordinate: Coordinate): Coordinate;
        static positionToGeographic(coordinate: Coordinate): Coordinate;

        // Calculations

        static calculateBounds(geojson: GeoJSON.GeoJsonObject): BBox;
        static calculateEnvelope(geojson: GeoJSON.GeoJsonObject): Envelope;
        static convexHull(geojson: Coordinates): Coordinates;

        // Comparisons

        static coordinatesContainPoint(coordinates: Coordinates[], coordinate: Coordinate): Boolean;
        static polygonContainsPoint(polygon: GeoJSON.Polygon, coordinate: Coordinate): Boolean;
        static polygonContainsPoint(polygon: GeoJSON.Position[][], coordinate: Coordinate): Boolean;
        static arrayIntersectsArray(c1: Coordinates[], c2: Coordinates[]): Boolean;
        static coordinatesEqual(c1: Coordinate, c2: Coordinate): Boolean;
    }
}

export = Terraformer;