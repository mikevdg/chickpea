import React from 'react';

import * as query from './query';

import './App.css';
import './DataTable.css';

export interface DataTableProps {
    table: query.Table;
    refetch: any; // function. TODO: what is its type?
}

/** I do not have any state. */
export class DataTable extends React.Component<DataTableProps> {
    constructor(props: Readonly<any>) {
        super(props);
        this.onOrderBy = this.onOrderBy.bind(this);
        this.onExpandComplexColumn = this.onExpandComplexColumn.bind(this);
        this.onUnexpandComplexColumn = this.onUnexpandComplexColumn.bind(this);
    }

    render() {
        return (
            <div className="datatable">

                <div className="datatable-filterdiv">
                    Filter
            </div>

                <div className="datatable-scrollwrapperdiv">
                    <div className="datatable-scrolldiv">
                        <div className="datatable-scroll-fakecontents"></div>
                    </div>

                    <div className="datatable-contentsdiv">

                        <table className="datatable-table">
                            <thead className="datatable-head">
                                {this.renderHeadings()}
                            </thead>
                            <tbody>
                                {this.renderTableContent()}
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        );
    }

    renderHeadings(): JSX.Element {
        let columns: Array<query.ColumnDefinition> = this.props.table.columns;
        let mmaxDepth: number = maxDepth(columns);

        if (columns.length === 0) {
            return <React.Fragment />
        } else {
            return <React.Fragment> {

                range(mmaxDepth).map(ddepth =>
                    (<tr>
                        {this.renderColumnsToHtmlAtDepth(columns, ddepth,
                            mmaxDepth)}
                    </tr>))
            } </React.Fragment>
        }
    }

    renderColumnsToHtmlAtDepth(
        columns: Array<query.ColumnDefinition>,
        ddepth: number,
        mmaxDepth: number)
        : JSX.Element {
        return (<React.Fragment>
            {columns.map(
                each => this.renderColumnToHtml(each, ddepth, mmaxDepth))}
        </React.Fragment>);
    }

    renderColumnToHtml(
        column: query.ColumnDefinition,
        ddepth: number,
        mmaxDepth: number)
        : JSX.Element {

        let renderMe: Array<query.ColumnDefinition> =
            columnAtDepth(column, ddepth);

        let collapse: JSX.Element;
        if (query.isComplex(column)) {
            if (query.isExpanded(this.props.table.query, column)) {
                collapse = miniButton("⏷",
                    (e) => this.onExpandComplexColumn(e, q, column));
            } else {
                collapse = miniButton("⏵", (e) => this.onUnexpandComplexColumn(e, q, column));
            }
        }

        let q = this.props.table.query;
        let orderBy: JSX.Element;
        switch (query.orderedBy(q, column)) {
            case query.OrderedBy.ASC:
                orderBy = miniButton("◢", (e) =>
                    this.onOrderBy(e, q, column, query.OrderedBy.ASC));
                break;
            case query.OrderedBy.DESC:
                orderBy = miniButton("◥", (e) =>
                    this.onOrderBy(e, q, column, query.OrderedBy.DESC));
                break;
            default:
                orderBy = miniButton("⊿", (e) =>
                    this.onOrderBy(e, q, column, query.OrderedBy.NA));
                break;
        }

        return (<React.Fragment>
            {renderMe.map(each =>
                <th
                    className="datatable-head-cell"
                    rowSpan={mmaxDepth - depth(column)}>
                    {collapse}
                    {each.name}
                    {orderBy}
                </th>
            )}
        </React.Fragment>);
    }

    renderTableContent(): JSX.Element[] {
        return (
            this.props.table.contents.map((eachRow) =>
                <tr>
                    {eachRow.cells.map((eachCell) =>
                        <td>
                            {String(eachCell)}
                        </td>
                    )}
                </tr>
            ));
    }

    onOrderBy(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        q: query.Query,
        column: query.ColumnDefinition,
        orderBy: query.OrderedBy
    )
        : void {
        console.log("Order by " + column.name);
        this.props.refetch();
    }

    onExpandComplexColumn(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        q: query.Query,
        column: query.ColumnDefinition
    )
        : void {
        console.log("Expand " + column.name);
    }

    onUnexpandComplexColumn(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        q: query.Query,
        column: query.ColumnDefinition
    )
        : void {
        console.log("Unexpand " + column.name);
    }


    /*
    <tr>
      <th rowSpan={2}>Column A</th>.Table, 
      <th colSpan={2}>Column B</th>
    </tr>
    <tr>
      <th>Column B1</th>
      <th>Column B2</th>
    </tr>*/
}


function depth(pin: query.ColumnDefinition): number {
    // Help! How do you differentiate between union types?
    if (!Number.isInteger(pin.type as any) && 'columns' in (pin.type as any)) {
        return 1 + maxDepth((pin.type as query.ComplexType).columns);
    } else {
        return 0;
    }
}

function maxDepth(pin: Array<query.ColumnDefinition>): number {
    return Math.max(0, Math.max.apply(null, pin.map(depth)));
}

function columnAtDepth(
    column: query.ColumnDefinition,
    ddepth: number)
    : Array<query.ColumnDefinition> {
    if (1 === ddepth) {
        return [column];
    } else {
        if (query.isComplex(column)) {
            let children: Array<query.ColumnDefinition> =
                ((column.type as query.ComplexType)).columns;
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