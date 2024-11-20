import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PriceChart from './components/PriceChart';
import PriceList from './components/PriceList.js';
import TransactionsTable from './components/TransactionsTable';
import styled from 'styled-components';
import './App.css';

const App = () => (
  <Container>
    <Sidebar />
    <MainContent>
      <Header />
      <Section>
        <PriceChart />
        <PriceList />
      </Section>
      <TransactionsTable />
    </MainContent>
  </Container>
);

export default App;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #0d1326;
  margin: 0;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #12172b;
  color: #ffffff;
`;

const Section = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

`;
