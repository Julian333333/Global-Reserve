// src/components/PriceList.js

import React from 'react';
import styled from 'styled-components';

const PriceList = () => {
  const prices = [
    { commodity: 'Gold (EUR)', price: 2500, trend: 'up' },
    { commodity: 'Gold (USD)', price: 2800, trend: 'up' },
    { commodity: 'Silver (USD)', price: 600, trend: 'down' },
    { commodity: 'Platinum (EUR)', price: 1000, trend: 'up' },
    { commodity: 'Platinum (USD)', price: 1250, trend: 'up' },
    { commodity: 'Lumber (EUR)', price: 550, trend: 'down' },
  ];

  return (
    <Container>
      <Title>Prices</Title>
      <List>
        {prices.map((item, index) => (
          <ListItem key={index}>
            {item.commodity}: {item.price} 
            <Trend trend={item.trend}>{item.trend === 'up' ? '↑' : '↓'}</Trend>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PriceList;

const Container = styled.div`
  background-color: #1a2238;
  padding: 20px;
  border-radius: 8px;
  color: #ffffff;
`;

const Title = styled.h3`
  margin: 0;
  margin-bottom: 15px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Trend = styled.span`
  color: ${(props) => (props.trend === 'up' ? 'green' : 'red')};
`;
