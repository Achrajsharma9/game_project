// src/services/api.js
import axios from 'axios';

const API_KEY = '96056e531e844d10889d52ccc5b91b91';
const BASE_URL = 'https://api.rawg.io/api';

export const fetchGames = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: API_KEY,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const fetchGameDetails = async (gameId) => {
  try {
    const response = await axios.get(`${BASE_URL}/games/${gameId}`, {
      params: {
        key: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};

export const fetchGameScreenshots = async (gameId) => {
  try {
    const response = await axios.get(`${BASE_URL}/games/${gameId}/screenshots`, {
      params: {
        key: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching screenshots:', error);
    throw error;
  }
};