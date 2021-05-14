import React, { RefObject } from 'react';

import * as query from './query';


import './App.css';
import './DataTable.css';

export interface DataTableProps {
    table: query.Query;
    refetch: any; // function. TODO: what is its type?
    children: never[];
}

export interface DataTableState {
    scrollIndex: number;
    aboveHeight: number;
    belowHeight: number;
}

/** I do not have any state. */
export class DataTable extends React.Component<DataTableProps, DataTableState> {
    private columnWidths : Array<number>;

    constructor(props: Readonly<DataTableProps>) {
        super(props);
        this.columnWidths = [];
        this.state = {
            scrollIndex: 0,
            aboveHeight: 1000,
            belowHeight: 1000
        }


        this.onOrderBy = this.onOrderBy.bind(this);
        this.onExpandComplexColumn = this.onExpandComplexColumn.bind(this);
        this.onUnexpandComplexColumn = this.onUnexpandComplexColumn.bind(this);
        this.renderColumnToHtml = this.renderColumnToHtml.bind(this);
        this.renderColumnsToHtmlAtDepth = this.renderColumnsToHtmlAtDepth.bind(this);
        this.renderHeadings = this.renderHeadings.bind(this);
        this.renderTableContent = this.renderTableContent.bind(this);
    }

    public static defaultProps = {
        table: (query.Query.create("", "")), // TODO: "Loading..."
        refetch: (() => { })
    }

    render = () => {
        if (this.columnWidths.length===0) {
            this.columnWidths = (
                range(this.props.table.numColumns()).map((a) => 100))
        }

        return (
            <div className="datatable">
                <input value={this.state.scrollIndex} />
                <div className="datatable-filterdiv">
                    Filter
                </div>
                <div
                    className="datatable-headerdiv"
                    style={this.gridStyle()}>
                    {this.renderHeadings()}
                </div>
                <div
                    className="datatable-contentsdiv"
                    style={this.gridStyle()}
                    onScroll={(e) => this.handleScroll(e)}>
                    {this.aboveHeight()}
                    {this.renderTableContent()}
                    {this.belowHeight()}
                </div>
            </div>
        );
    }

    aboveHeight = () => {
        const layout = {
            height: this.state.aboveHeight,
            gridRowStart: 1,
            gridRowEnd: 1,
            gridColumnStart: 1,
            gridColumnEnd: 1
        }
        return <div style={layout}></div>;
    }

    belowHeight = () => {
        const last = 100; // TODO: number of rows.
        const layout = {
            height: this.state.belowHeight,
            gridRowStart: last,
            gridRowEnd: last,
            gridColumnStart: last,
            gridColumnEnd: last
        }
        return <div style={layout}></div>;
    }

    gridStyle = () => {
        let c =
            this.columnWidths
                .map((each) => `${each}px `)
                .reduce((a, v) => a.concat(v), "");

        console.log(c);

        return {
            display: 'grid',
            gridTemplateColumns: c
        };
    }

    renderHeadings(): JSX.Element {
        let columns: query.ComplexColumnDefinition = this.props.table._select;
        let mmaxDepth: number = columns.depth();

        if (columns.isEmpty()) {
            return <React.Fragment />
        } else {
            return <React.Fragment> {

                range(mmaxDepth).map(ddepth =>
                (<React.Fragment>
                    {this.renderColumnsToHtmlAtDepth(columns, ddepth,
                        mmaxDepth)}
                </React.Fragment>
                ))
            } </React.Fragment>
        }
    }

    renderColumnsToHtmlAtDepth(
        columns: query.ComplexColumnDefinition,
        ddepth: number,
        mmaxDepth: number)
        : JSX.Element {
        return (<React.Fragment>
            {columns.map(
                (each, i) => this.renderColumnToHtml(each, i, ddepth, mmaxDepth))}
        </React.Fragment>);
    }

    renderColumnToHtml(
        column: query.ColumnDefinition,
        index: number,
        ddepth: number,
        mmaxDepth: number)
        : JSX.Element {
        let t = this.props.table;

        let renderMe: Array<query.ColumnDefinition> =
            columnAtDepth(column, ddepth);

        let collapse: JSX.Element;
        if (column.isComplex()) {
            if (this.props.table.isExpanded(column)) {
                collapse = miniButton("⏷",
                    (e) => this.onExpandComplexColumn(e, t, column));
            } else {
                collapse = miniButton("⏵", (e) => this.onUnexpandComplexColumn(e, t, column));
            }
        }

        let orderBy: JSX.Element;
        switch (query.orderedBy(t, column)) {
            case query.OrderedBy.ASC:
                orderBy = miniButton("◢", (e) =>
                    this.onOrderBy(e, t, column, query.OrderedBy.DESC));
                break;
            case query.OrderedBy.DESC:
                orderBy = miniButton("◥", (e) =>
                    this.onOrderBy(e, t, column, query.OrderedBy.NA));
                break;
            default:
                orderBy = miniButton("⊿", (e) =>
                    this.onOrderBy(e, t, column, query.OrderedBy.ASC));
                break;
        }

        const layout = {
            gridRowStart: ddepth,
            gridRowEnd: ddepth,
            gridColumnStart: index,
            gridColumnEnd: index
        }

        return (<React.Fragment>
            {renderMe.map(each =>
                <div
                    className="datatable-head-cell"
                    style={layout}
                    /*rowSpan={mmaxDepth - column.depth()}*/>
                    {collapse}
                    {each.name}
                    {orderBy}
                </div>
            )}
        </React.Fragment>);
    }

    renderTableContent(): JSX.Element[] {
        return (
            this.props.table.contents.map((eachRow, row) =>
                <React.Fragment>
                    {eachRow.cells.map((eachCell, column) => {
                        const layout = {
                            gridRowStart: row+2,
                            gridRowEnd: row+2,
                            gridColumnStart: column,
                            gridColumnEnd: column
                            
                        }
                        return <div className="datatable-cell" style={layout}>
                            {String(eachCell)}
                        </div>
                    }
                    )}
                </React.Fragment>
            ));
    }

    onOrderBy(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        t: query.Query,
        column: query.ColumnDefinition,
        orderBy: query.OrderedBy
    )
        : void {
        let t2 = t.copy();
        t2.orderBy(column, orderBy);
        this.props.refetch(t2);
    }

    onExpandComplexColumn(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        t: query.Query,
        column: query.ColumnDefinition
    )
        : void {
        this.props.refetch(t.copy().expand(column));
    }

    onUnexpandComplexColumn(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        t: query.Query,
        column: query.ColumnDefinition
    )
        : void {
        console.log("Unexpand " + column.name);
    }

    handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        // TODO: A much better way of doing this is to have hidden divs above
        // and below the content, and resize them.
        // https://codesandbox.io/s/react-virtual-scrolling-basics-u1svg
        this.setState({ scrollIndex: (event.target as any).scrollTop });
    }
}

function columnAtDepth(
    column: query.ColumnDefinition,
    ddepth: number)
    : Array<query.ColumnDefinition> {
    if (1 === ddepth) {
        return [column];
    } else {
        if (column.isComplex()) {
            let children: Array<query.ColumnDefinition> =
                column.childs();
            return flatten(
                children.map(columnAtDepth)
            );
        } else {
            return []; // We are below the depth of a primitive column.
        }
    }
}

function range(to: number) {
    let result = Array.from(Array(to + 1).keys());
    result.shift(); // Remove the zero.
    return result;
}

function flatten(list: Array<any>) {
    return [].concat.apply([], list);
}

function miniButton(
    contents: string,
    action: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)) {
    return (<button onClick={action} className="datatable-minibutton">{contents}</button>);
}

