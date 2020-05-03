


export interface DataTableState {
    table: Table;
}

export interface Query {
    skip?: number;
    top?: number;
    orderby?: Array<ColumnDefinition>;
    expand: Array<ColumnDefinition>;
    select: Array<ColumnDefinition>;  
    count: boolean;
    filter?: any; // TODO - the filter.
    search?: string;
    [key: string]: any;
}

export function createQuery() 
: Query
{
    return {
        expand: [],
        select: [],
        count: false
    };
}

export function createQueryFrom(
    name: string,
    columns: Array<ColumnDefinition>
) {
    let result = createQuery();
    result.select = columns;

    return result;
}

export enum TypeEnum {
    PrimitiveType,
    ComplexType
}

/* The column heading, and it's type. */
export interface ColumnDefinition {
    name: string;
    typeEnum: TypeEnum;
    type: PrimitiveType | ComplexType ;
    isCollection: boolean;
}

export function isComplex(c : ColumnDefinition) : boolean {
    return c.typeEnum === TypeEnum.ComplexType;
}

export function isExpanded(query :Query, column :ColumnDefinition) : boolean {
    // TODO: query.expand should be a hierarchy.
    // return query.expand.some( each => each===column );
    return true;
}

export enum OrderedBy {
    ASC,
    DESC,
    NA
}

export function orderedBy(query :Query, column :ColumnDefinition) : OrderedBy {
    return OrderedBy.ASC; // TODO
}

/* This list is from the OData XML or JSON specs:
https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html

https://docs.oasis-open.org/odata/odata-csdl-json/v4.01/odata-csdl-json-v4.01.html#_Toc31791166

Note that very few of these are implemented yet.

*/
export enum PrimitiveType {
    Binary	, //	Binary data
    Boolean	, //	Binary-valued logic
    Byte	, //	Unsigned 8-bit integer
    Date	, //	Date without a time-zone offset
    DateTimeOffset	, //	Date and time with a time-zone offset, no leap seconds
    Decimal	, //	Numeric values with decimal representation
    Double	, //	IEEE 754 binary64 floating-point number (15-17 decimal digits)
    Duration	, //	Signed duration in days, hours, minutes, and (sub)seconds
    Guid	, //	16-byte (128-bit) unique identifier
    Int16 	, //	Signed 16-bit integer
    Int32	, //	Signed 32-bit integer
    Int64	, //	Signed 64-bit integer
    SByte	, //	Signed 8-bit integer
    Single	, //	IEEE 754 binary32 floating-point number (6-9 decimal digits)
    Stream	, //	Binary data stream
    String	, //	Sequence of characters
    TimeOfDay	, //	Clock time 00:00-23:59:59.999999999999
    Geography	, //	Abstract base type for all Geography types
    GeographyPoint	, //	A point in a round-earth coordinate system
    GeographyLineString	, //	Line string in a round-earth coordinate system
    GeographyPolygon	, //	Polygon in a round-earth coordinate system
    GeographyMultiPoint	, //	Collection of points in a round-earth coordinate system
    GeographyMultiLineString	, //	Collection of line strings in a round-earth coordinate system
    GeographyMultiPolygon	, //	Collection of polygons in a round-earth coordinate system
    GeographyCollection	, //	Collection of arbitrary Geography values
    Geometry	, //	Abstract base type for all Geometry types
    GeometryPoint	, //	Point in a flat-earth coordinate system
    GeometryLineString	, //	Line string in a flat-earth coordinate system
    GeometryPolygon	, //	Polygon in a flat-earth coordinate system
    GeometryMultiPoint	, //	Collection of points in a flat-earth coordinate system
    GeometryMultiLineString	, //	Collection of line strings in a flat-earth coordinate system
    GeometryMultiPolygon	, //	Collection of polygons in a flat-earth coordinate system
    GeometryCollection	, //	Collection of arbitrary Geometry values
}

/* A column can have multiple sub-columns from a 1..1 join to another table. This is one of those. */
export interface ComplexType {
    isExpanded: boolean; // If false, don't look at columns.
    columns: Array<ColumnDefinition>;
}

export interface Row {
    cells: Array<any>;
}

export interface Table {
    name: string;
    query: Query;
    columns: Array<ColumnDefinition>;
    contents: Array<Row>;
}

export function createTable(name: string, columns: Array<ColumnDefinition>) 
: Table 
{
    return  {
        name: name,
        query: createQueryFrom(name, columns),
        columns: columns,
        contents: []
    };
}
