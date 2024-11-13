// src/components/PriceCard.js
import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
  background: rgba(255,255,255,0.08);
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #2a3f5a;
  text-align: center;
`;

const Title = styled.h3`
  color: #ffd700;
  margin: 0;
`;

const Price = styled.div`
  font-size: 1.5rem;
  color: #ffd700;
  font-weight: bold;
  margin: 0.5rem 0;
`;

const Change = styled.div`
  color: #ffffff;
  margin-bottom: 1rem;
`;

const TradeButton = styled.button`
  background: #ffd700;
  color: #1a237e;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

function PriceCard({ name, price }) {
  return (
    <Card>
      <Title>{name.replace('_', ' ').toUpperCase()}</Title>
      <Price>{price ? `$${price.toFixed(2)}` : 'Loading...'}</Price>
      <Change>24h: --</Change>
      <TradeButton>Trade</TradeButton>
    </Card>
  );
}

export default PriceCard;