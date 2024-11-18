import React from 'react';
import Sidebar from './components/Sidebar';
import PriceList from './components/PriceList';
import TransactionsTable from './components/TransactionsTable';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <div className="chart">
          {/* Placeholder for the chart */}
          <h2>Gold Price</h2>
          <div style={{ backgroundColor: '#1e293b', height: '300px', borderRadius: '8px' }}></div>
        </div>
        <PriceList />
        <TransactionsTable />
      </div>
    </div>
  );
};

export default App;
