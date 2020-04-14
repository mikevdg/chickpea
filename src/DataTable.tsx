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
            OData.asTable((await metadata).content, this.props.tableName)
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

    headings() {
        return (
            <tr>
                {
                    this.state.table.columns.map(
                        (each) =>
                            <th className="datatable-head-cell">{each.name}</th>

                    )}
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

