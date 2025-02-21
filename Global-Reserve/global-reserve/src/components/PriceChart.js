import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styled from 'styled-components';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';

const ChartBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Dropdown = styled.select`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #0b0f22;
  color: #fff;
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: #ffd700;
  }
  option {
    background: #0b0f22;
    color: #fff;
  }
`;

const PriceChart = () => {
  const [symbol, setSymbol] = useState('gold');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/commodityprice?name=${symbol}`, {
        method: 'GET',
        headers: { 'X-Api-Key': '5DUagI8vNs0xpDJKRIgIPA==41Xe7h6HvLXWr7mx' },
        contentType: 'application/json'
      });
      
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      
      const data = await response.json();
      if (!data || typeof data !== 'object' || !data.price || !data.updated) {
        throw new Error('Invalid API data');
      }

      const timestamp = new Date(data.updated * 1000);
      
      // Save to Firebase
      await addDoc(collection(db, symbol), {
        price: data.price,
        timestamp: timestamp,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const loadChartData = async () => {
    try {
      const q = query(collection(db, symbol), orderBy('timestamp', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const labels = [];
      const prices = [];
      
      querySnapshot.forEach((doc) => {
        const entry = doc.data();
        const timeString = new Date(entry.timestamp.seconds * 1000).toLocaleString();
        labels.push(timeString);
        prices.push(entry.price);
      });

      setChartData({
        labels,
        datasets: [{
          label: `${symbol.toUpperCase()} Price`,
          data: prices,
          fill: false,
          borderColor: symbol === 'gold' ? '#ffd700' : symbol === 'lumber' ? '#8B4513' : symbol === 'platinum' ? '#E5E4E2' : '#B5A642',
          tension: 0.1,
        }],
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [symbol]);

  useEffect(() => {
    loadChartData();
  }, [symbol]);

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
    setChartData(null);
    setLoading(true);
  };

  return (
    <ChartBox>
      <Dropdown value={symbol} onChange={handleSymbolChange}>
        <option value="gold">Gold</option>
        <option value="lumber">Lumber</option>
        <option value="platinum">Platinum</option>
      </Dropdown>
      {loading || !chartData ? <p>Loading Chart...</p> : <Line data={chartData} />}
    </ChartBox>
  );
};

export default PriceChart;