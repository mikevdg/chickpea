import React from 'react';
import { DataTable } from './DataTable';
import { Room } from './Room';
import * as query from './query';


import './App.css';
import './DataTable.css';

class App extends React.Component<any, query.DataTableState> {
  private readonly url: string = 'https://services.odata.org/TripPinRESTierService/(S(mly0lemodbb4rmdukjup4lcm))/';
  readonly tableName = 'People';

  render() {
    return (
      <div className="App">
        <Room url={this.url} tableName={this.tableName}>
          <DataTable>
          </DataTable>
        </Room>
      </div>
    );
  }
}

export default App;
