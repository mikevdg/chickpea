import React from 'react';
import * as OData from './odata/odata';
import * as query from './query';
import * as WebRequest from 'web-request';

import './App.css';
import './DataTable.css';

interface DataTableProps {
    url: string;
    tableName: string;
}

interface DataTableState {
    table: query.Table;
}

export class DataTable extends React.Component<DataTableProps, DataTableState> {
    constructor(props: Readonly<any>) {
        super(props);
        this.state = { table: OData.emptyTable() };
        this.orderBy = this.orderBy.bind(this);
        this.expandComplexColumn = this.expandComplexColumn.bind(this);
        this.unexpandComplexColumn = this.unexpandComplexColumn.bind(this);
    }

    async componentDidMount() {
        // See https://www.npmjs.com/package/web-request

        let metadata = WebRequest.get(OData.metadataURL(this.props.url));
        let cells = WebRequest.get(OData.tableURL(this.props.url, this.props.tableName));

        let table: query.Table =
            OData.asTable((await metadata).content, this.props.tableName, [])
        OData.setContents(table, (await cells).content);

        this.setState({ table: table });
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
        let columns: Array<query.ColumnDefinition> = this.state.table.columns;
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
            if (query.isExpanded(this.state.table.query, column)) {
                collapse = miniButton("⏷",
                    (e) => this.expandComplexColumn(e, q, column));
            } else {
                collapse = miniButton("⏵", (e) => this.unexpandComplexColumn(e, q, column));
            }
        }

        let q = this.state.table.query;
        let orderBy: JSX.Element;
        switch (query.orderedBy(q, column)) {
            case query.OrderedBy.ASC:
                orderBy = miniButton("◢", (e) =>
                    this.orderBy(e, q, column, query.OrderedBy.ASC));
                break;
            case query.OrderedBy.DESC:
                orderBy = miniButton("◥", (e) =>
                    this.orderBy(e, q, column, query.OrderedBy.DESC));
                break;
            default:
                orderBy = miniButton("⊿", (e) =>
                    this.orderBy(e, q, column, query.OrderedBy.NA));
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
            this.state.table.contents.map((eachRow) =>
                <tr>
                    {eachRow.cells.map((eachCell) =>
                        <td>
                            {String(eachCell)}
                        </td>
                    )}
                </tr>
            ));
    }

    orderBy(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        q: query.Query,
        column: query.ColumnDefinition,
        orderBy: query.OrderedBy
    )
        : void {
        console.log("Order by " + column.name);
    }

    expandComplexColumn(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        q: query.Query,
        column: query.ColumnDefinition
    )
        : void {
        console.log("Expand " + column.name);
    }

    unexpandComplexColumn(
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