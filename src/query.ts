import * as WebRequest from 'web-request';
import * as OData from './odata/odata';

export interface DataTableState {
    table: Table;
}

export interface Query {
    skip?: number;
    top?: number;
    orderBy: Array<OrderedByEntry>;
    _expand: ExpandList;
    select: Array<ColumnDefinition>;
    count: boolean;
    filter?: any; // TODO - the filter.
    search?: string;
    //[key: string]: any;
}

interface OrderedByEntry {
    column: ColumnDefinition;
    orderedBy: OrderedBy;
}

export function createQuery()
    : Query {
    return {
        _expand: new ExpandList(),
        select: [],
        orderBy: [],
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

    isComplex() : boolean {
        return this._typeEnum === TypeEnum.ComplexType;
    }

    get name() : string { 
        return this._name;
    }

    equals(c : ColumnDefinition) : boolean {
        return this._name === c._name && this._parent === c._parent;
    }

    childs() : Array<ColumnDefinition> {
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

/** Return how that column in the query is ordered. */
export function orderedBy(table: Table, column: ColumnDefinition): OrderedBy {
    let query: Query = table.query;
    let possibleResult = query.orderBy.find(
        each => each.column.name === column.name);
    if (possibleResult) {
        return possibleResult.orderedBy;
    } else {
        return OrderedBy.NA;
    }
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

export class ExpandList {
    _list : Array<ColumnDefinition>;

    constructor() {
        this._list = [];
    }
 
    add(column : ColumnDefinition) {
        if (this._list.some( (each) => each.equals(column))) {
            return this;
        } else {
            this._list.push(column);
        }
    }

    isExpanded(column : ColumnDefinition) : boolean {
        return true;
    }
}

export class Table {
    _baseURL: string;
    _name: string;
    _query: Query;
    _columns: Array<ColumnDefinition>;
    _contents: Array<Row>;

    constructor(baseURL: string, name: string) {
        this._baseURL = baseURL;
        this._name = name;
        this._contents = [];
        this._query = createQueryFrom(this._name, []);
        this._columns = [];
        this.url = this.url.bind(this);
        this.copy = this.copy.bind(this);
    }

    get columns() : Array<ColumnDefinition> {
        return this._columns;
    }

    set columns(c : Array<ColumnDefinition>) {
        this._columns = c;
    }

    get query() : Query {
        return this._query;
    }

    get contents() : Array<Row> {
        return this._contents;
    }

    set contents(c : Array<Row>) {
        this._contents = c;
    }

    expand(column: ColumnDefinition) {
        this._query._expand.add(column);
        return this;
    }

    isExpanded(column: ColumnDefinition) : boolean {
        return this._query._expand.isExpanded(column);
    }

    orderBy(column: ColumnDefinition, by: OrderedBy) {
        this._query.orderBy = [{ column: column, orderedBy: by }];
        return this;
    }

    copy(): Table {
        let result: Table = new Table(this._baseURL, this._name);
        result._query = this._query;
        result._columns = this._columns;
        result._contents = this._contents;
        return result;
    }

    url(): string {
        let base = this._baseURL + "/" + this._name
        if (this._query.orderBy.length > 0) {
            return base + "?"+this.urlOrderedBy();
        } else {
            return base;
        }
    }

    urlOrderedBy(): string {
        let result: string = "$orderby="+this._query.orderBy[0].column.name + "%20";
        switch (this._query.orderBy[0].orderedBy) {
            case OrderedBy.ASC:
                return result + "asc";
            case OrderedBy.DESC:
                return result + "desc";
            default:
                return "";
        }
    }
}

export async function refetch(t: Table) {
    // See https://www.npmjs.com/package/web-request
    let url = t.url();

    let metadata = WebRequest.get(OData.metadataURL(t._baseURL));
    OData.setTableColumns(t, (await metadata).content, t._name);

    let cells = WebRequest.get(url);
    OData.setContents(t, (await cells).content);
}
