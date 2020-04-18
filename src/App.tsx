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


  export default App;
