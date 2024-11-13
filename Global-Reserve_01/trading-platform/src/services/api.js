// src/services/api.js
import axios from 'axios';

const API_KEY = '5DUagI8vNs0xpDJKRIgIPA==41Xe7h6HvLXWr7mx'; // Replace with your actual API key

export const fetchPrice = async (commodity) => {
  try {
    const response = await axios.get(
      `https://api.api-ninjas.com/v1/commodityprice?name=${commodity}`,
      {
        headers: { 'X-Api-Key': API_KEY }
      }
    );
    return response.data.price;
  } catch (error) {
    console.error(`Error fetching ${commodity} price:`, error);
    return null;
  }
};

