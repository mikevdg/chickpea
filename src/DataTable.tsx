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
                                {this.headings()}
                            </thead>
                            <tbody>
                                {this.tableContent()}
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        );
    }

    columnsToHtml(
        columns: Array<query.ColumnDefinition>,
        depth: number,
        maxDepth: number): JSX.Element {

        if (columns.length===0) {
            return <React.Fragment/>
        }

        return <React.Fragment>
            {Array.from(Array(maxDepth).keys()).map(depth =>
                columns.map(
                    eachColumn => this.columnToHtml(eachColumn, depth, maxDepth))
            )}
        </React.Fragment>
    }

    columnToHtml(
        column: query.ColumnDefinition,
        ddepth: number,
        maxDepth: number): JSX.Element {
        if (1 === ddepth) {
            return  (<th 
                className="datatable-head-cell" 
                rowSpan={maxDepth-depth(column)}>
                     {column.name}
            </th>);
        } else {
            if (!Number.isInteger(column.type as any) 
                && 'columns' in (column.type as any)) {
                return this.columnsToHtml(
                    (column.type as query.ComplexType).columns,
                    ddepth - 1,
                    maxDepth)
            } else return (<p>foo</p>);
        }
    }

    headings() {
        let mmaxDepth: number = maxDepth(this.state.table.columns);
        return (
            <tr>
                {this.columnsToHtml(this.state.table.columns, 1, mmaxDepth)}
            </tr>
        );
    }

    tableContent() {
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
