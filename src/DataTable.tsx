import React from 'react';
import * as OData from './odata/odata';
import * as query from './query';
import * as WebRequest from 'web-request';

import './App.css';
import './DataTable.css';

interface DataTableProps { }

interface DataTableState {
    table: query.Table;
}

export class DataTable extends React.Component<DataTableProps, DataTableState> {
    constructor(props: Readonly<any>) {
        super(props);
        this.state = { table: OData.emptyTable() };
    }

    componentDidMount() {
        // See https://www.npmjs.com/package/web-request

        WebRequest.get('https://services.odata.org/TripPinRESTierService/(S(mly0lemodbb4rmdukjup4lcm))/$metadata')
            .then(
                (response) => {
                    console.log("Got data.");
                    this.setState(
                        {
                            table: OData.asTable(response.content, 'People')
                        })
                }
                ,
                (error) => console.log("Error: " + error));
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
                                {this.columns()}
                            </thead>
                            <tbody>

                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        );
    }

    columns() {
        return (
            <tr>
                {
                    this.state.table.columns.map(
                        (each) =>
                            <th>{each.name}</th>

                    )}
            </tr>
        );
    }

    /*
    <tr>
      <th rowSpan={2}>Column A</th>
      <th colSpan={2}>Column B</th>
    </tr>
    <tr>
      <th>Column B1</th>
      <th>Column B2</th>
    </tr>*/
}

