// src/components/Transactions.js
import React from 'react';
import styled from '@emotion/styled';

const TransactionsContainer = styled.div`
  padding: 2rem;
  color: #ffffff;
`;

function Transactions() {
  return (
    <TransactionsContainer>
      <h1>Transactions</h1>
      <p>View your transaction history here.</p>
    </TransactionsContainer>
  );
}

export default Transactions;