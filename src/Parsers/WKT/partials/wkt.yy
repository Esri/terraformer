

%lex

%%

\s+                           // ignore
"("                           return '('
")"                           return ')'
"-"?(([0-9]+\.?)|([0-9]*\.?[0-9]+)([eE][-+]?[0-9]+)?)    return 'DOUBLE_TOK'
"POINT"                       return 'POINT'
"LINESTRING"                  return 'LINESTRING'
"POLYGON"                     return 'POLYGON'
"MULTIPOINT"                  return 'MULTIPOINT'
"MULTILINESTRING"             return 'MULTILINESTRING'
"MULTIPOLYGON"                return 'MULTIPOLYGON'
","                           return 'COMMA'
<<EOF>>                       return 'EOF'
.                             return "INVALID"

/lex


%start expressions

%% /* language grammar */

expressions
    : point EOF
        { return { "type": "Point", "coordinates": $1.data[0] }; }
    | linestring EOF
        { return { "type": "LineString", "coordinates": $1.data }; }
    | polygon EOF
        { return { "type": "Polygon", "coordinates": $1.toJSON() }; }
    | multipoint EOF
        { return { "type": "MultiPoint", "coordinates": $1.data }; }
    | multilinestring EOF
        { return { "type": "MultiLineString", "coordinates": $1.toJSON() }; }
    | multipolygon EOF
        { return { "type": "MultiPolygon", "coordinates": $1.toJSON() }; }
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
        { $$ = $3; }
    ;

point_untagged
    : coordinate
        { $$ = $1; }
    | '(' coordinate ')'
        { $$ = $2; }
    ;

polygon_list
    : polygon_list COMMA polygon_untagged
        { console.log("adding: " + $3.type + " to " + $1.type);$$ = $1.addPolygon($3); }
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
        { $$ = $3; }
    ;

polygon
    : POLYGON '(' ring_list ')'
        { $$ = $3; }
    ;

multipoint
    : MULTIPOINT '(' point_list ')'
        { $$ = $3; }
    ;

multilinestring
    : MULTILINESTRING '(' ring_list ')'
        { $$ = $3; }
    ;

multipolygon
    : MULTIPOLYGON '(' polygon_list ')'
        { $$ = $3; }
    ;
