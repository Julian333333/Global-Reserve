import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1>Global Reserve</h1>
      <ul>
        <li>Dashboard</li>
        <li>Transactions</li>
        <li>Payments</li>
        <li>Profile</li>
        <li>Settings</li>
        <li>Log Out</li>
      </ul>
    </div>
  );
};

export default Sidebar;
