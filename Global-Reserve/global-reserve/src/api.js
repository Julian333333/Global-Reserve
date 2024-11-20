const apiKey = '5DUagI8vNs0xpDJKRIgIPA==41Xe7h6HvLXWr7mx'; // Replace 'YOUR_API_KEY' with your actual API key

export async function fetchPrices() {
    const commodities = ['gold', 'silver', 'platinum', 'lumber'];
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