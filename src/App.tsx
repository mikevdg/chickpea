import React from 'react';
import { DataTable } from './DataTable';
import { Room } from './Room';
import * as query from './query';


import './App.css';
import './DataTable.css';

class App extends React.Component {
  private readonly url: string = 'https://services.odata.org/V4/TripPinServiceRW/';
  readonly tableName = 'People';
  
  render() {
    let q : query.Query = query.Query.create(this.url, this.tableName);

    return (
      <div className="App">
        <Room query={q}>
          <DataTable>
          </DataTable>
        </Room>
      </div>
    );
  }
}

export default App;
