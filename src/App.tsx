import React from 'react';
import { DataTable, range } from './DataTable';
import { Room } from './Room';
import * as query from './query';


import './App.css';
import './DataTable.css';

class App extends React.Component {
  private readonly url: string = 'https://services.odata.org/V4/TripPinServiceRW/';
  readonly tableName = 'People';
  
  render() {
    let q : query.Query = query.ODataQuery.create(this.url, this.tableName);
    /*let q : query.Query = new query.CollectionQuery(
      [{name:'foo'}, {name: 'bar'}, {name: 'baz'}], 
      range(20000).map(each => [each, each+100, each+10000]));*/

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
