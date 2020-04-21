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

        let table : query.Table = 
            OData.asTable((await metadata).content, this.props.tableName, [])
        OData.setContents(table, (await cells).content );
        
        this.setState( { table: table });
                
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

    depth(pin: query.ColumnDefinition): number {
        if ('columns' in (pin.type as any)) {
            return 1+this.maxDepth((pin.type as query.ComplexType).columns);
        } else {
            return 0;
        }
    }

    maxDepth(pin: Array<query.ColumnDefinition>): number {
        return Math.max.apply(pin.map(this.depth));
    }

    columnsToHtml (
        columns: Array<query.ColumnDefinition>, 
        depth: number, 
        maxDepth: number) : JSX.Element {

        return <React.Fragment>
         {Array.from(Array(maxDepth).keys()).map( depth =>
            columns.map( 
                eachColumn => this.columnToHtml(eachColumn, depth, maxDepth))
         )}
         </React.Fragment>
    }

    columnToHtml (
        column: query.ColumnDefinition, 
        depth: number, 
        maxDepth: number) : JSX.Element {

        if (1===depth) {
            return  (<th 
                className="datatable-head-cell" 
                rowSpan={maxDepth-this.depth(column)}>
                     {column.name}
            </th>);
        } else {
            if ('columns' in (column.type as any)) {
                return this.columnsToHtml( 
                    (column.type as query.ComplexType).columns, 
                    depth-1,
                    maxDepth)
            } else return (<p>foo</p>);
        }
    }

    headings() {
        let maxDepth: number = this.maxDepth(this.state.table.columns);
        return (
            <tr>
                {this.columnsToHtml(this.state.table.columns, 1, maxDepth)}
            </tr>
        );
    }

    tableContent() {
        return (
            this.state.table.contents.map( (eachRow) =>
                <tr>
                    {eachRow.cells.map( (eachCell) =>
                        <td>
                            { String(eachCell) }
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
