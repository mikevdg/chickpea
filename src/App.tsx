import React from 'react';
import { DataTable } from './DataTable';
import { Room } from './Room';
import * as query from './query';


import './App.css';
import './DataTable.css';

class App extends React.Component {
  private readonly url: string = 'https://services.odata.org/TripPinRESTierService/(S(mly0lemodbb4rmdukjup4lcm))/';
  readonly tableName = 'People';

  render() {
    let q : query.Query = query.Query.create(this.url, this.tableName);

    return (
      <div className="App">
        // TODO: The room needs a whole query as input somehow: 
        <Room query={q}>
          <DataTable>
          </DataTable>
        </Room>
      </div>
    );
  }
}

export default App;
