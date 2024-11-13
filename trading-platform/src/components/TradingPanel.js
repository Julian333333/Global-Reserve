// src/components/TradingPanel.js
import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import PriceCard from './PriceCard';
import { fetchPrice } from '../services/api';

const Panel = styled.div`
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

function TradingPanel() {
  const [prices, setPrices] = useState({});
  const commodities = useMemo(() => ['gold', 'aluminium', 'platinum', 'palladium', 'lumber'], []);

  useEffect(() => {
    const updatePrices = async () => {
      const newPrices = {};
      for (const commodity of commodities) {
        const price = await fetchPrice(commodity);
        newPrices[commodity] = price;
      }
      setPrices(newPrices);
    };

    updatePrices();
    const interval = setInterval(updatePrices, 30000);
    return () => clearInterval(interval);
  }, [commodities]);

  return (
    <Panel>
      <Grid>
        {commodities.map(commodity => (
          <PriceCard
            key={commodity}
            name={commodity}
            price={prices[commodity]}
          />
        ))}
      </Grid>
    </Panel>
  );
}

export default TradingPanel;