/* A "Query" is the model for a data table on the screen. It contains all 
the state of a query, plus the contents of the current screen-full of data. 
*/

import * as OData from './odata/odata';

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

export interface Query {
    name: String;
    select: ComplexColumnDefinition;
    expand(column: ColumnDefinition) : Query;
    isExpanded(column: ColumnDefinition): boolean;
    getOrderBy() : OrderedByEntry[];
    orderBy(column: ColumnDefinition, by: OrderedBy) : Query;
    count() : number;
    numColumns(): number;

    get(from: number, to: number) : Row[];

    copy() : Query; // Needed to make React prop updates work.

    refetchColumns() : void ;
    refetchContents() : void;
}

abstract class AbstractQuery implements Query {
    _tableName: string;
    _orderBy: Array<OrderedByEntry>; // Which columns to sort by.
    _select: ComplexColumnDefinition; // The visible columns, and whether they're expanded.
    _count: boolean; // TODO whether I'm a 'select count(*)'
    _filter?: any; // TODO
    _search?: string; // TODO - generic string search
    //[key: string]: any;


    constructor() {
        this._tableName = "";
        this._orderBy = [];
        this._count = false;

        // We use this super-column to contain a list of my actual visible columns.
        this._select = new ComplexColumnDefinition("Supercolumn", undefined);
    }

    abstract copy() : Query;

    copyFrom(other: AbstractQuery): Query {
        this._tableName = other._tableName;
        this._orderBy = other._orderBy;
        this._count = other._count;
        this._select = other._select;
        return this;
    }

    get name() { return this._tableName; }

    set name(tableName: string) {
        this._tableName = tableName;
    }

    get select(): ComplexColumnDefinition  {
        return this._select;
    }

    getOrderBy = () => {
        return this._orderBy;
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

    abstract count() : number ;

    numColumns : () => number = () => {
        return this._select.numColumns();
    }

    abstract get(from: number, to: number) : Row[];

    refetchColumns() {}
    refetchContents() {}

}

export interface CollectionQueryColumn {
    name: string;
}

export class CollectionQuery extends AbstractQuery {
    contents:  Array<Array<any>> ;

    constructor(columns: Array<CollectionQueryColumn>, contents: Array<any>) {
        super();
        columns.forEach( each => 
            this.select.columns.push(new PrimitiveColumnDefinition(each.name, PrimitiveType.String)));
        this.contents = contents;
    }

    count = () => {
        return this.contents.length;
    }

    get: (from: number, to: number) => Row[] = 
        (from: number, to: number) => {
            let s : any[] = this.contents.slice(from, to);
            let rows : Row[] = s.map(each => { return {cells:each}})
            return rows;
    }

    copy : () => Query = () => {
        return new CollectionQuery(this.select.columns, this.contents).copyFrom(this);
    }
}

export class ODataQuery extends AbstractQuery {
    _baseURL: string;
    _skip?: number;
    _top?: number;
    _contents: Array<Row>;

    static create(baseURL: string, name: string): Query {
        let result = new this().baseURL(baseURL);
        result.name = name;
        return result;
    }

    constructor() {
        super();
        this._baseURL = "";
        this._contents = [];
        this.url = this.url.bind(this);
        this.copy = this.copy.bind(this);
        this.refetchColumns = this.refetchColumns.bind(this);
        this.refetchContents = this.refetchContents.bind(this);
    }

    copy = () => {
        return new ODataQuery().copyFrom(this);
    }

    copyFrom(other: ODataQuery): Query {
        super.copyFrom(other);
        this._baseURL = other._baseURL;
        this._contents = other._contents;
        return this;
    }


    baseURL(url: string): Query {
        this._baseURL = url;
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

    async refetchColumns() {
        let response = fetch(OData.metadataURL(this._baseURL));
        let data = (await response).text();
        OData.setTableColumns(this, await data, this._tableName);
    }
    
    async refetchContents() {
        let response = fetch(this.url());
        OData.setContents(this, await ((await response).json()));
    }

    get contents(): Array<Row> {
        return this._contents;
    }

    set contents(c: Array<Row>) {
        this._contents = c;
        console.log(`Got ${this._contents.length} elements.`);
    }

    get columns() : Array<ColumnDefinition> {
        return this._select.columns;
    }

    set columns(columns : Array<ColumnDefinition>) {
        this._select.columns = columns;
    }

    count = () => {
        // TODO
        return this._contents.length;
    }

    get: (from: number, to: number) => Row[] = 
    (from: number, to: number) => {
        console.log(`Getting from ${from} to ${to}`);
        return this._contents.slice(from, to);
    }
}

interface OrderedByEntry {
    column: ColumnDefinition;
    orderedBy: OrderedBy;
}

/* The column heading, and it's type. */
export abstract class ColumnDefinition {
    _name: string;

    // _type and childColumns are mutually exclusive.
    _parent?: ColumnDefinition;
    // TODO _isCollection: boolean;

    constructor(name: string, parent?: ColumnDefinition) {
        this._name = name;
        this._parent = undefined;
        //this._isCollection = false;
    }

    abstract isComplex(): boolean;

    get name(): string {
        return this._name;
    }

    equals(c: ColumnDefinition): boolean {
        return this._name === c._name && this._parent === c._parent;
    }

    childs(): Array<ColumnDefinition> {
        return [];
    }

    depth(): number {
        return 1;
    }

    numColumns() : number { 
        return 1;
    }
}

export class PrimitiveColumnDefinition extends ColumnDefinition {
    _type: PrimitiveType;

    constructor(name: string, type: PrimitiveType, parent?: ColumnDefinition) {
        super(name, parent);
        this._type = type;
    }

    isComplex() : boolean {
        return false;
    }
}

export class ComplexColumnDefinition extends ColumnDefinition {
    isExpanded: boolean; 
    childColumns: Array<ColumnDefinition>;

    constructor(name: string, parent?: ColumnDefinition) {
        super(name, parent);
        this.isExpanded = false;
        this.childColumns = [];
    }

    isComplex() : boolean {
        return true;
    }

    childs(): Array<ColumnDefinition> {
        return this.childColumns;
    }

    depth() : number {
        let maxDepth = 0;
        for (let i=0; i<this.childColumns.length; i++) {
            let current = this.childColumns[i].depth();
            if (current > maxDepth) {
                maxDepth = current;
            }
        }
        return maxDepth + 1;
    }

    map<U>(callbackfn: (value: ColumnDefinition, index: number, array: ColumnDefinition[]) => U, thisArg?: any): U[] {
        return this.childColumns.map(callbackfn);
    }

    isEmpty() : boolean {
        return this.childColumns.length === 0;
    }

    get columns() : Array<ColumnDefinition> {
        return this.childColumns;
    }

    set columns(c : Array<ColumnDefinition>) {
        this.childColumns = c;
    }

    numColumns() : number {
        let sum=0; 
        for (let i=0; i<this.childColumns.length; i++) {
            sum = sum + this.childColumns[i].numColumns();
        }
        return Math.max(1, sum);
    }
}



export interface Row {
    cells: Array<any>;
}

/** Return how that column in the query is ordered. */
export function orderedBy(table: Query, column: ColumnDefinition): OrderedBy {
    let possibleResult = table.getOrderBy().find(
        each => each.column.name === column.name);
    if (possibleResult) {
        return possibleResult.orderedBy;
    } else {
        return OrderedBy.NA;
    }
}
