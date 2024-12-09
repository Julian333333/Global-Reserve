// src/components/Sidebar.js
import React from 'react';
import styled from '@emotion/styled';

const SidebarContainer = styled.aside`
  background-color: #0a1929;
  border-right: 1px solid #2a3f5a;
  padding: 2rem 1rem;
`;

const MarketList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MarketItem = styled.li`
  padding: 1rem;
  cursor: pointer;
  color: ${props => props.active ? '#ffd700' : '#ffffff'};
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
  border-radius: 4px;
  margin-bottom: 0.5rem;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }
`;

function Sidebar() {
  return (
    <SidebarContainer>
      <MarketList>
        <MarketItem active>Commodities</MarketItem>
        <MarketItem>Forex</MarketItem>
        <MarketItem>Stocks</MarketItem>
      </MarketList>
    </SidebarContainer>
  );
}

export default Sidebar;