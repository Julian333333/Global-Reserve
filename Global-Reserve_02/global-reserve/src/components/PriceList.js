import React from 'react';
import './PriceList.css';

const PriceList = () => {
  const prices = [
    { name: 'Gold (EUR)', value: '2500', trend: 'up' },
    { name: 'Gold (USD)', value: '2800', trend: 'up' },
    { name: 'Silver (USD)', value: '600', trend: 'down' },
    { name: 'Platin (EUR)', value: '1000', trend: 'up' },
    { name: 'Platin (USD)', value: '1250', trend: 'up' },
    { name: 'Lumber (EUR)', value: '550', trend: 'down' },
  ];

  return (
    <div className="price-list">
      <h2>Prices</h2>
      <ul>
        {prices.map((price, index) => (
          <li key={index} className={price.trend}>
            {price.name}: {price.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceList;
