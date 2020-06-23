/* A "Query" is the model for a data table on the screen. It contains all the state of a query, plus the contents of the current screen-full of data. 
*/

export class Query {
    _baseURL: string;
    _tableName: string;

    _skip?: number;
    _top?: number;
    _orderBy: Array<OrderedByEntry>; // Which columns to sort by.
    _select: SelectColumns; // The visible columns, and whether they're expanded.
    _count: boolean; // TODO whether I'm a 'select count(*)'
    _filter?: any; // TODO
    _search?: string; // TODO - generic string search
    //[key: string]: any;

    _contents: Array<Row>;

    static create(baseURL: string, name: string): Query {
        return new this().baseURL(baseURL).name(name);
    }

    constructor() {
        this._baseURL = "";
        this._tableName = "";
        this._contents = [];
        this._orderBy = [];
        this._count = false;
        this._select = new SelectColumns();
        this.url = this.url.bind(this);
        this.copy = this.copy.bind(this);
    }

    copy(): Query {
        return new Query().copyFrom(this);
    }

    copyFrom(other: Query): Query {
        this._baseURL = other._baseURL;
        this._tableName = other._tableName;
        this._contents = other._contents;
        this._orderBy = other._orderBy;
        this._count = other._count;
        this._select = other._select;
        return this;
    }

    baseURL(url: string): Query {
        this._baseURL = url;
        return this;
    }

    name(tableName: string): Query {
        this._tableName = tableName;
        return this;
    }

    get contents(): Array<Row> {
        return this._contents;
    }

    set contents(c: Array<Row>) {
        this._contents = c;
    }

    expand(column: ColumnDefinition) {
        //this._query._expand.add(column);
        return this;
    }

    isExpanded(column: ColumnDefinition): boolean {
        //return this._query._expand.isExpanded(column);
        return false;
    }

    orderBy(column: ColumnDefinition, by: OrderedBy) {
        this._orderBy = [{ column: column, orderedBy: by }];
        return this;
    }


    url(): string {
        let base = this._baseURL + "/" + this._tableName;
        if (this._orderBy.length > 0) {
            return base + "?" + this.urlOrderedBy();
        } else {
            return base;
        }
    }

    urlOrderedBy(): string {
        let result: string = "$orderby=" + this._orderBy[0].column.name + "%20";
        switch (this._orderBy[0].orderedBy) {
            case OrderedBy.ASC:
                return result + "asc";
            case OrderedBy.DESC:
                return result + "desc";
            default:
                return "";
        }
    }
}

interface OrderedByEntry {
    column: ColumnDefinition;
    orderedBy: OrderedBy;
}

export enum TypeEnum {
    PrimitiveType,
    ComplexType
}

/* The column heading, and it's type. */
export class ColumnDefinition {
    _name: string;
    _typeEnum: TypeEnum;
    _type: PrimitiveType | ComplexType;
    _parent?: ColumnDefinition;
    _isCollection: boolean;

    constructor(name: string, type: PrimitiveType | ComplexType, parent?: ColumnDefinition) {
        this._name = name;
        this._typeEnum = TypeEnum.PrimitiveType;
        this._type = type;
        this._parent = undefined;
        this._isCollection = false;
    }

    isComplex(): boolean {
        return this._typeEnum === TypeEnum.ComplexType;
    }

    get name(): string {
        return this._name;
    }

    equals(c: ColumnDefinition): boolean {
        return this._name === c._name && this._parent === c._parent;
    }

    childs(): Array<ColumnDefinition> {
        if (TypeEnum.ComplexType !== this._typeEnum) {
            return [];
        }
        return (this._type as ComplexType).columns;
    }
}

export enum OrderedBy {
    ASC,
    DESC,
    NA
}

/* This list is from the OData XML or JSON specs:
https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html

https://docs.oasis-open.org/odata/odata-csdl-json/v4.01/odata-csdl-json-v4.01.html#_Toc31791166

Note that very few of these are implemented yet.

*/
export enum PrimitiveType {
    Binary, //	Binary data
    Boolean, //	Binary-valued logic
    Byte, //	Unsigned 8-bit integer
    Date, //	Date without a time-zone offset
    DateTimeOffset, //	Date and time with a time-zone offset, no leap seconds
    Decimal, //	Numeric values with decimal representation
    Double, //	IEEE 754 binary64 floating-point number (15-17 decimal digits)
    Duration, //	Signed duration in days, hours, minutes, and (sub)seconds
    Guid, //	16-byte (128-bit) unique identifier
    Int16, //	Signed 16-bit integer
    Int32, //	Signed 32-bit integer
    Int64, //	Signed 64-bit integer
    SByte, //	Signed 8-bit integer
    Single, //	IEEE 754 binary32 floating-point number (6-9 decimal digits)
    Stream, //	Binary data stream
    String, //	Sequence of characters
    TimeOfDay, //	Clock time 00:00-23:59:59.999999999999
    Geography, //	Abstract base type for all Geography types
    GeographyPoint, //	A point in a round-earth coordinate system
    GeographyLineString, //	Line string in a round-earth coordinate system
    GeographyPolygon, //	Polygon in a round-earth coordinate system
    GeographyMultiPoint, //	Collection of points in a round-earth coordinate system
    GeographyMultiLineString, //	Collection of line strings in a round-earth coordinate system
    GeographyMultiPolygon, //	Collection of polygons in a round-earth coordinate system
    GeographyCollection, //	Collection of arbitrary Geography values
    Geometry, //	Abstract base type for all Geometry types
    GeometryPoint, //	Point in a flat-earth coordinate system
    GeometryLineString, //	Line string in a flat-earth coordinate system
    GeometryPolygon, //	Polygon in a flat-earth coordinate system
    GeometryMultiPoint, //	Collection of points in a flat-earth coordinate system
    GeometryMultiLineString, //	Collection of line strings in a flat-earth coordinate system
    GeometryMultiPolygon, //	Collection of polygons in a flat-earth coordinate system
    GeometryCollection, //	Collection of arbitrary Geometry values
}

/* A column can have multiple sub-columns from a 1..1 join to another table. This is one of those. */
export interface ComplexType {
    isExpanded: boolean; // If false, don't look at columns.
    columns: Array<ColumnDefinition>;
}

export interface Row {
    cells: Array<any>;
}

class SelectColumns {
    _list: Array<ColumnDefinition>;

    constructor() {
        this._list = [];
    }

    add(column: ColumnDefinition) {
        if (this._list.some((each) => each.equals(column))) {
            return this;
        } else {
            this._list.push(column);
        }
    }

    isExpanded(column: ColumnDefinition): boolean {
        return true;
    }
}

/** Return how that column in the query is ordered. */
export function orderedBy(table: Query, column: ColumnDefinition): OrderedBy {
    let possibleResult = table._orderBy.find(
        each => each.column.name === column.name);
    if (possibleResult) {
        return possibleResult.orderedBy;
    } else {
        return OrderedBy.NA;
    }
}
