import React from 'react';
import * as OData from './odata/odata';
import * as Dt from './DataTable';
import * as query from './query';
import * as WebRequest from 'web-request';

import './App.css';
import './DataTable.css';

class App extends React.Component<any, query.DataTableState> {
  readonly url: string = 'https://services.odata.org/TripPinRESTierService/(S(mly0lemodbb4rmdukjup4lcm))/';
  readonly tableName = 'People';

  constructor(props: Readonly<any>) {
    super(props);
    this.refetch = this.refetch.bind(this);
    this.state = { table: OData.emptyTable() };
  }


  componentDidMount() {
    this.refetch();
  }

  async refetch() {
    // See https://www.npmjs.com/package/web-request

    console.log("Refetching "+this.url);

    let metadata = WebRequest.get(OData.metadataURL(this.url));
    let cells = WebRequest.get(OData.tableURL(this.url, this.tableName));

    let table: query.Table =
      OData.asTable((await metadata).content, this.tableName, [])
    OData.setContents(table, (await cells).content);

    this.setState({ table: table });
  }

  render() {
    return (
      <div className="App">
        <Dt.DataTable table={this.state.table} refetch={this.refetch}>

        </Dt.DataTable>
      </div>
    );
  }
}


export default App;
