import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Notwendig, um Chart.js zu initialisieren
import styled from 'styled-components';

// Box-Container für den Chart
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
  background: #0b0f22; // Dunklerer Hintergrund
  color: #fff; // Helle Schriftfarbe
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: #ffd700;
  }
  option {
    background: #0b0f22; // Dunklerer Hintergrund für Optionen
    color: #fff; // Helle Schriftfarbe für Optionen
  }
`;

const PriceChart = () => {
  const [symbol, setSymbol] = useState('gold');
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch(`https://api.api-ninjas.com/v1/commodityprice?name=${symbol}`, {
      method: 'GET',
      headers: { 'X-Api-Key': '5DUagI8vNs0xpDJKRIgIPA==41Xe7h6HvLXWr7mx' },
      contentType: 'application/json'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `API-Request fehlgeschlagen mit Status ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log('API-Daten:', data); // Debugging-Informationen

        // Überprüfen Sie, ob data ein Objekt ist und ob es das erwartete Format hat
        if (!data || typeof data !== 'object' || !data.price || !data.updated) {
          throw new Error('Ungültige Daten von der API erhalten');
        }

        // Erstellen Sie Labels und Preise basierend auf den erhaltenen Daten
        const labels = [new Date(data.updated * 1000).toLocaleTimeString()];
        const prices = [data.price];

        setChartData((prevData) => ({
          labels: [...(prevData.labels || []), ...labels],
          datasets: [
            {
              label: `${symbol.toUpperCase()} Preis`,
              data: [...(prevData.datasets ? prevData.datasets[0].data : []), ...prices],
              fill: false,
              borderColor: '#ffd700',
              tension: 0.1,
            },
          ],
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen der Chartdaten:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10000 Millisekunden = 10 Sekunden
    return () => clearInterval(interval); // Aufräumen des Intervalls bei Komponentendemontage
  }, [symbol]);

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
    setChartData({}); // Clear the chart data when the symbol changes
    setLoading(true); // Set loading to true when the symbol changes
  };

  return (
    <ChartBox>
      <Dropdown value={symbol} onChange={handleSymbolChange}>
        <option value="gold">Gold</option>
        <option value="lumber">Lumber</option>
        <option value="platinum">Platinum</option>
        <option value="palladium">Palladium</option>
      </Dropdown>
      {loading ? (
        <p>Lade Chart...</p>
      ) : (
        <Line data={chartData} />
      )}
    </ChartBox>
  );
};

export default PriceChart;
