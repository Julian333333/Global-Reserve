// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { fetchPrices } from './api.js';

const commodities = ['gold', 'silver', 'oil'];
const setPrices = (prices) => {
    console.log(prices);
};

fetchPrices(commodities, setPrices);

// Hole das Root-Element
const rootElement = document.getElementById('root');

// Erstelle die React-Root mit createRoot
const root = ReactDOM.createRoot(rootElement);

// Render die App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
