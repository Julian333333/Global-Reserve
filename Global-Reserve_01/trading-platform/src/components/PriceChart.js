// src/components/PriceChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styled from '@emotion/styled';
import { fetchPrice } from '../services/api';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 1.5rem;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Dropdown = styled.select`
  background: #1a237e;
  color: #ffd700;
  border: 1px solid #ffd700;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

function PriceChart() {
  const [selectedCommodity, setSelectedCommodity] = useState('gold');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Gold Price',
      data: [],
      borderColor: '#ffd700',
      tension: 0.1
    }]
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#ffffff' }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#ffffff' }
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#ffffff' }
      }
    }
  };

  useEffect(() => {
    const updateChartData = async () => {
      const price = await fetchPrice(selectedCommodity);
      const now = new Date().toLocaleTimeString();

      setChartData(prevData => {
        const newLabels = [...prevData.labels, now];
        const newData = [...prevData.datasets[0].data, price];

        if (newLabels.length > 20) {
          newLabels.shift();
          newData.shift();
        }

        return {
          labels: newLabels,
          datasets: [{
            ...prevData.datasets[0],
            label: `${selectedCommodity.replace('_', ' ').toUpperCase()} Price`,
            data: newData
          }]
        };
      });
    };

    updateChartData();
    const interval = setInterval(updateChartData, 30000);
    return () => clearInterval(interval);
  }, [selectedCommodity]);

  const handleCommodityChange = (event) => {
    setSelectedCommodity(event.target.value);
  };

  return (
    <ChartContainer>
      <Dropdown value={selectedCommodity} onChange={handleCommodityChange}>
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
        <option value="platinum">Platinum</option>
        <option value="palladium">Palladium</option>
        <option value="crude_oil">Crude Oil</option>
      </Dropdown>
      <ChartWrapper>
        <Line data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
}

export default PriceChart;