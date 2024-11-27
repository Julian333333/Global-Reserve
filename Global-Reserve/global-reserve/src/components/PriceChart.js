// src/components/PriceChart.js

import React, { useEffect, useState } from 'react';
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
import { fetchChartPrices } from '../api.js'; // Import the new function

// Register the Chart components
ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend);

const PriceChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const getChartPrices = async () => {
      const data = await fetchChartPrices('gold'); // Fetch data for gold
      if (data) {
        setChartData(data);
      }
    };

    getChartPrices();
  }, []);

  if (!chartData || !chartData.prices || chartData.prices.length === 0) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: chartData.prices.map((_, index) => index + 1), // Assuming prices is an array of price values
    datasets: [
      {
        label: chartData.commodity,
        data: chartData.prices,
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
      <h3 style={{ color: '#ffffff' }}>{chartData.commodity}</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
