// src/components/PriceList.js

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { fetchPrices } from '../api.js'; // Adjust the path as necessary

const PriceList = () => {
  const [prices, setPrices] = useState([]);
  const previousPricesRef = useRef([]);

  useEffect(() => {
    const getPrices = async () => {
      const fetchedPrices = await fetchPrices();
      console.log('Fetched Prices:', fetchedPrices); // Log the fetched prices

      // Determine the trend based on previous prices
      const updatedPrices = fetchedPrices.map((item, index) => {
        const previousPrice = previousPricesRef.current[index]?.price || 0;
        const trend = item.price > previousPrice ? 'up' : item.price < previousPrice ? 'down' : 'unknown';
        return { ...item, trend };
      });

      previousPricesRef.current = fetchedPrices;
      setPrices(updatedPrices);
    };

    getPrices();
    const interval = setInterval(getPrices, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const renderPrices = () => {
    return prices.map((item, index) => (
      <ListItem key={index}>
        {item.commodity}: {item.price} 
        <Trend trend={item.trend}>{item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '-'}</Trend>
      </ListItem>
    ));
  };

  return (
    <Container>
      <Title>Prices</Title>
      <List>
        {renderPrices()}
      </List>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  background-color: #1a2238;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #ffffff;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #2a2e47;
  font-size: 18px;
  color: #ffffff;
`;

const Trend = styled.span`
  color: ${props => (props.trend === 'up' ? '#2ecc71' : props.trend === 'down' ? '#e74c3c' : '#ffffff')};
  font-weight: bold;
`;

export default PriceList;
