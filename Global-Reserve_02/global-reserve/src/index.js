// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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
