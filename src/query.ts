

export interface Query {
    $skip?: number;
    $top?: number;
    $filter?: string;
    $orderby?: string;
    $expand?: string;
    $select?: string;  
    $count?: boolean;
    $search?: string;
    $format?: string;
    $compute?: string;
    $index?: number;
    [key: string]: any;
}

export enum ColumnType {
    String,
    Integer
}

export interface StringCell {
    value: string;
}

export interface IntegerCell {
    value: number;
}

export type Cell = 
    StringCell 
    | IntegerCell

export interface ColumnDefinition {
    name: string;
    type: ColumnType;
}

export interface Row {
    cells: Array<Cell>;
}

export interface Table {
    name: string;
    query: Query;
    columns: Array<ColumnDefinition>;
    contents: Array<Row>;
}
