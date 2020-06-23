import React from 'react';

import * as query from './query';


import './App.css';
import './DataTable.css';

export interface DataTableProps {
    table: query.Query;
    refetch: any; // function. TODO: what is its type?
    children: never[];
}

/** I do not have any state. */
export class DataTable extends React.Component<DataTableProps> {
    constructor(props: Readonly<DataTableProps>) {
        super(props);
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
        let columns: query.ComplexColumnDefinition = this.props.table._select;
        let mmaxDepth: number = columns.depth();

        if (columns.isEmpty()) {
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
        columns: query.ComplexColumnDefinition,
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

        return (<React.Fragment>
            {renderMe.map(each =>
                <th
                    className="datatable-head-cell"
                    rowSpan={mmaxDepth - column.depth()}>
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

