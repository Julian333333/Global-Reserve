// src/components/PriceChart.js

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registriere die Chart-Komponenten
ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend);

const PriceChart = () => {
  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
      {
        label: 'Gold Price',
        data: [750, 200, 450, 700, 500, 300, 400, 600, 800],
        borderColor: 'yellow',
        backgroundColor: 'yellow',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#1a2238', padding: '20px', borderRadius: '8px' }}>
      <h3 style={{ color: '#ffffff' }}>Gold Price</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
