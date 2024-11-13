// src/components/Portfolio.js
import React from 'react';
import styled from '@emotion/styled';

const PortfolioContainer = styled.div`
  padding: 2rem;
  color: #ffffff;
`;

function Portfolio() {
  return (
    <PortfolioContainer>
      <h1>Portfolio</h1>
      <p>View and manage your investment portfolio here.</p>
    </PortfolioContainer>
  );
}

export default Portfolio;