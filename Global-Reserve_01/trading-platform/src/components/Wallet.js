// src/components/Wallet.js
import React from 'react';
import styled from '@emotion/styled';

const WalletContainer = styled.div`
  padding: 2rem;
  color: #ffffff;
`;

function Wallet() {
  return (
    <WalletContainer>
      <h1>Wallet</h1>
      <p>Manage your funds and transactions here.</p>
    </WalletContainer>
  );
}

export default Wallet;