import React from 'react';
import * as WebRequest from 'web-request';
import * as OData from './odata/odata';

import './App.css';
import './DataTable.css';

function App() {
  httpGetSchema().then(
    (response) => 
      OData.asTable(response.content, 'foo')
    ,
    (error) => console.log("Error: "+error));
 
  

  return (
    <div className="App">
      
       

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
                    <tr>
                      <th rowSpan={2}>Column A</th>
                      <th colSpan={2}>Column B</th>
                    </tr>
                    <tr>
                      <th>Column B1</th>
                      <th>Column B2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columns()}
                  </tbody>
                </table>

              </div>

            </div>
          </div>
     
     
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

function httpGetSchema() {
  // See https://www.npmjs.com/package/web-request

  return WebRequest.get('https://services.odata.org/TripPinRESTierService/(S(mly0lemodbb4rmdukjup4lcm))/$metadata');
}


  export default App;
