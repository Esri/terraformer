

%lex

%%

\s+                           // ignore
"("                           return '('
")"                           return ')'
"-"?[0-9]+("."[0-9]+)?        return 'DOUBLE_TOK'
"POINT"                       return 'POINT'
"LINESTRING"                  return 'LINESTRING'
"POLYGON"                     return 'POLYGON'
"MULTIPOINT"                  return 'MULTIPOINT'
"MULTILINESTRING"             return 'MULTILINESTRING'
"MULTIPOLYGON"                return 'MULTIPOLYGON'
","                           return 'COMMA'
"EMPTY"                       return 'EMPTY'
"M"                           return 'M'
"Z"                           return 'Z'
"ZM"                          return 'ZM'
<<EOF>>                       return 'EOF'
.                             return "INVALID"

/lex


%start expressions

%% /* language grammar */

expressions
    : point EOF
        { return $1; }
    | linestring EOF
        { return $1; }
    | polygon EOF
        { return $1; }
    | multipoint EOF
        { return $1; }
    | multilinestring EOF
        { return $1; }
    | multipolygon EOF
        { return $1; }
    ;

coordinate
    : DOUBLE_TOK DOUBLE_TOK
        { $$ = new PointArray([ Number($1), Number($2) ]); }
    | DOUBLE_TOK DOUBLE_TOK DOUBLE_TOK
        { $$ = new PointArray([ Number($1), Number($2), Number($3) ]); }
    | DOUBLE_TOK DOUBLE_TOK DOUBLE_TOK DOUBLE_TOK
        { $$ = new PointArray([ Number($1), Number($2), Number($3), Number($4) ]); }
    ;

ptarray
    : ptarray COMMA coordinate
        { $$ = $1.addPoint($3); }
    | coordinate
        { $$ = $1; }
    ;

ring_list
    : ring_list COMMA ring
        { $$ = $1.addRing($3); }
    | ring
        { $$ = new RingList($1); }
    ;

ring
    : '(' ptarray ')'
        { $$ = new Ring($2); }
    ;

point
    : POINT '(' ptarray ')'
        { $$ = { "type": "Point", "coordinates": $3.data[0] }; }
    | POINT Z '(' ptarray ')'
        { $$ = { "type": "Point", "coordinates": $4.data[0], "properties": { z: true } }; }
    | POINT ZM '(' ptarray ')'
        { $$ = { "type": "Point", "coordinates": $4.data[0], "properties": { z: true, m: true } }; }
    | POINT M '(' ptarray ')'
        { $$ = { "type": "Point", "coordinates": $4.data[0], "properties": { m: true } }; }
    | POINT EMPTY
        { $$ = { "type": "Point", "coordinates": [ ] }; }
    ;

point_untagged
    : coordinate
        { $$ = $1; }
    | '(' coordinate ')'
        { $$ = $2; }
    ;

polygon_list
    : polygon_list COMMA polygon_untagged
        { $$ = $1.addPolygon($3); }
    | polygon_untagged
        { $$ = new PolygonList($1); }
    ;

polygon_untagged
    : '(' ring_list ')'
        { $$ = $2; }
    ;


point_list
    : point_list COMMA point_untagged
        { $$ = $1.addPoint($3); }
    | point_untagged
        { $$ = $1; }
    ;

linestring
    : LINESTRING '(' point_list ')'
        { $$ = { "type": "LineString", "coordinates": $3.data }; }
    | LINESTRING Z '(' point_list ')'
        { $$ = { "type": "LineString", "coordinates": $4.data, "properties": { z: true } }; }
    | LINESTRING M '(' point_list ')'
        { $$ = { "type": "LineString", "coordinates": $4.data, "properties": { m: true } }; }
    | LINESTRING ZM '(' point_list ')'
        { $$ = { "type": "LineString", "coordinates": $4.data, "properties": { z: true, m: true } }; }
    | LINESTRING EMPTY
        { $$ = { "type": "LineString", "coordinates": [ ] }; }
    ;

polygon
    : POLYGON '(' ring_list ')'
        { $$ = { "type": "Polygon", "coordinates": $3.toJSON() }; }
    | POLYGON Z '(' ring_list ')'
        { $$ = { "type": "Polygon", "coordinates": $4.toJSON(), "properties": { z: true } }; }
    | POLYGON M '(' ring_list ')'
        { $$ = { "type": "Polygon", "coordinates": $4.toJSON(), "properties": { m: true } }; }
    | POLYGON ZM '(' ring_list ')'
        { $$ = { "type": "Polygon", "coordinates": $4.toJSON(), "properties": { z: true, m: true } }; }
    | POLYGON EMPTY
        { $$ = { "type": "Polygon", "coordinates": [ ] }; }
    ;

multipoint
    : MULTIPOINT '(' point_list ')'
        { $$ = { "type": "MultiPoint", "coordinates": $3.data }; }
    | MULTIPOINT Z '(' point_list ')'
        { $$ = { "type": "MultiPoint", "coordinates": $4.data, "properties": { z: true } }; }
    | MULTIPOINT M '(' point_list ')'
        { $$ = { "type": "MultiPoint", "coordinates": $4.data, "properties": { m: true } }; }
    | MULTIPOINT ZM '(' point_list ')'
        { $$ = { "type": "MultiPoint", "coordinates": $4.data, "properties": { z: true, m: true } }; }
    | MULTIPOINT EMPTY
        { $$ = { "type": "MultiPoint", "coordinates": [ ] } }
    ;

multilinestring
    : MULTILINESTRING '(' ring_list ')'
        { $$ = { "type": "MultiLineString", "coordinates": $3.toJSON() }; }
    | MULTILINESTRING Z '(' ring_list ')'
        { $$ = { "type": "MultiLineString", "coordinates": $4.toJSON(), "properties": { z: true } }; }
    | MULTILINESTRING M '(' ring_list ')'
        { $$ = { "type": "MultiLineString", "coordinates": $4.toJSON(), "properties": { m: true } }; }
    | MULTILINESTRING ZM '(' ring_list ')'
        { $$ = { "type": "MultiLineString", "coordinates": $4.toJSON(), "properties": { z: true, m: true } }; }
    | MULTILINESTRING EMPTY
        { $$ = { "type": "MultiLineString", "coordinates": [ ] }; }
    ;

multipolygon
    : MULTIPOLYGON '(' polygon_list ')'
        { $$ = { "type": "MultiPolygon", "coordinates": $3.toJSON() }; }
    | MULTIPOLYGON Z '(' polygon_list ')'
        { $$ = { "type": "MultiPolygon", "coordinates": $4.toJSON(), "properties": { z: true } }; }
    | MULTIPOLYGON M '(' polygon_list ')'
        { $$ = { "type": "MultiPolygon", "coordinates": $4.toJSON(), "properties": { m: true } }; }
    | MULTIPOLYGON ZM '(' polygon_list ')'
        { $$ = { "type": "MultiPolygon", "coordinates": $4.toJSON(), "properties": { z: true, m: true } }; }
    | MULTIPOLYGON EMPTY
        { $$ = { "type": "MultiPolygon", "coordinates": [ ] }; }
    ;
