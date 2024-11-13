// src/components/TransactionsTable.js

import React from 'react';
import styled from 'styled-components';

const TransactionsTable = () => {
  const transactions = [
    {
      id: '001',
      commodity: 'Gold (EUR)',
      amount: '15000 €',
      date: '13.11.2024',
      status: 'Pending',
    },
  ];

  return (
    <TableContainer>
      <TableTitle>Transactions</TableTitle>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Purchased Commodity</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Status</TableHeader>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableData>{transaction.id}</TableData>
              <TableData>{transaction.commodity}</TableData>
              <TableData>{transaction.amount}</TableData>
              <TableData>{transaction.date}</TableData>
              <TableData>{transaction.status}</TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTable;

const TableContainer = styled.div`
  background-color: #1a2238;
  padding: 20px;
  border-radius: 8px;
  color: #ffffff;
`;

const TableTitle = styled.h3`
  margin: 0;
  margin-bottom: 15px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 10px;
  background-color: #2a2e47;
  color: #ffffff;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #2a2e47;
  }
`;

const TableData = styled.td`
  padding: 10px;
  color: #ffffff;
`;
