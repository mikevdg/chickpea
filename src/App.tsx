import React from 'react';
import * as OData from './odata/odata';
import * as Dt from './DataTable';

import './App.css';
import './DataTable.css';

function App() {
 
 
  

  return (
    <div className="App">
      <Dt.DataTable url='https://services.odata.org/TripPinRESTierService/(S(mly0lemodbb4rmdukjup4lcm))/' tableName='People'>

      </Dt.DataTable>
    </div>
  );
}

function columns() {
  return (
    Array.from(Array(100).keys()).map((each) =>
      <tr>
        <td className="datatable-cell">One {each}</td>
        <td className="datatable-cell">Two {each}</td>
        <td className="datatable-cell">Three {each}</td>
      </tr>
    )
  )
}


  export default App;
