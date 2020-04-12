import React from 'react';
import './App.css';
import './DataTable.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <table className="datatable">
            <thead className="datatable-head">
              <tr>
                <th rowSpan={2}>Column A</th>
                <th colSpan={2}>Column B</th> 
              </tr>
              <tr>
                <th>
                  <th rowSpan={2}>Column B1</th>
                  <th colSpan={2}>Column B2</th>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="datatablecell">One</td>
                <td>Two</td>
              </tr>
            </tbody>
          </table>
        </p>
      </header>
    </div>
  );
}

export default App;
