const apiKey = '5DUagI8vNs0xpDJKRIgIPA==41Xe7h6HvLXWr7mx'; // Replace 'YOUR_API_KEY' with your actual API key

export async function fetchPrices() {
    const commodities = ['gold', 'platinum', 'lumber'];
    try {
        const prices = await Promise.all(
            commodities.map(async (name) => {
                const response = await fetch(`https://api.api-ninjas.com/v1/commodityprice?name=${name}`, {
                    method: 'GET',
                    headers: { 'X-Api-Key': apiKey },
                });
                if (!response.ok) {
                    throw new Error(`Error fetching ${name}: ${response.statusText}`);
                }
                const result = await response.json();
                console.log(`Fetched ${name}:`, result); // Log the result
                return {
                    commodity: `${name.charAt(0).toUpperCase() + name.slice(1)} (USD)`,
                    price: result.price,
                    trend: result.trend || 'unknown', // Assuming the API provides a trend field
                };
            })
        );
        return prices;
    } catch (error) {
        console.error('Error fetching prices:', error);
        return [];
    }
}

export async function fetchChartPrices(commodity) {
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/commodityprice?name=${commodity}`, {
            method: 'GET',
            headers: { 'X-Api-Key': apiKey },
        });
        if (!response.ok) {
            throw new Error(`Error fetching ${commodity}: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(`Fetched ${commodity} for chart:`, result); // Log the result
        return {
            commodity: `${commodity.charAt(0).toUpperCase() + commodity.slice(1)} (USD)`,
            prices: result.prices || [], // Assuming the API provides a prices field with historical data
        };
    } catch (error) {
        console.error('Error fetching chart prices:', error);
        return null;
    }
}