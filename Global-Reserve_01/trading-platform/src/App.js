// src/App.js
import React from 'react';
import styled from '@emotion/styled';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Wallet from './components/Wallet';
import Portfolio from './components/Portfolio';
import Transactions from './components/Transactions';
import About from './components/About';
import Contact from './components/Contact';
import FAQ from './components/FAQ';

const AppContainer = styled.div`
  background-color: #0a1929;
  min-height: 100vh;
  color: #ffffff;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Navigation />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/faq" component={FAQ} />
        </Switch>
      </AppContainer>
    </Router>
  );
}

export default App;
