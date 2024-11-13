// src/components/Dashboard.js
import React from 'react';
import styled from '@emotion/styled';
import Sidebar from './Sidebar';
import TradingPanel from './TradingPanel';
import PriceChart from './PriceChart';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  height: calc(100vh - 64px);
`;

const MainContent = styled.main`
  padding: 1rem;
`;

function Dashboard() {
  return (
    <DashboardContainer>
      <Sidebar />
      <MainContent>
        <PriceChart />
        <TradingPanel />
      </MainContent>
    </DashboardContainer>
  );
}

export default Dashboard;