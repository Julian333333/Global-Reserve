import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Wallet from './pages/Wallet'; // Importiere die Walletseite
import Transactions from './pages/Transactions.js'; 
import PriceChart from './components/PriceChart';
import PriceList from './components/PriceList.js';
import TransactionsTable from './components/TransactionsTable';
import Login from './pages/Login'; // Adjust based on your actual file structure
import Profile from './pages/Profile'; // Importiere die Profilseite
import Register from './pages/Register.js';
import styled from 'styled-components';
import './App.css';

const apiKey = '5DUagI8vNs0xpDJKRIgIPA==41Xe7h6HvLXWr7mx'; // Replace with your actual API key

const App = () => (
  <BrowserRouter>
    <Container>
      <Sidebar />
      <MainContent>
        <Header />
        <Routes>
          {/* Define the routes for your app */}
          <Route
            path="/"
            element={
              <div>
                {/* Main Dashboard */}
                <Section>
                  <PriceChart symbol="GOLD" apiKey={apiKey} />
                  <PriceList />
                </Section>
                <TransactionsTable />
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} /> {/* Füge die Route für die Profilseite hinzu */}
          {/* Add more routes as needed */}
          <Route path="/register" element={<Register />} />
          <Route path="/wallet" element={<Wallet />} /> {/* Add the Wallet route */}
          {/* Add other routes as needed */}
          <Route path="/transactions" element={<Transactions />} /> {/* Add the Wallet route */}
          {/* Add other routes as needed */}
        </Routes>
      </MainContent>
    </Container>
  </BrowserRouter>
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

  // Ensure child components are evenly distributed
  & > div {
    flex: 1;
  }
`;
