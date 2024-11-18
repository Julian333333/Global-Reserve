import React from 'react';
import './TransactionsTable.css';

const TransactionsTable = () => {
  const transactions = [
    {
      id: '001',
      commodity: 'Gold (EUR)',
      amount: '15,000 €',
      date: '13.11.2024',
      status: 'Pending',
    },
  ];

  return (
    <div className="transactions-table">
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Purchased Commodity</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.commodity}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
