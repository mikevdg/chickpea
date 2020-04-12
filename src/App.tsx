import React from 'react';
import './App.css';
import './DataTable.css';

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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>

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
        </p>
      </header>
    </div>
  );
}

export default App;
