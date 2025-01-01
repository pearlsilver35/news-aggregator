import axios from 'axios';
import { API_BASE_URL } from '../config';

export const filterService = {
  async getCategories() {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  },

  async getSources() {
    const response = await axios.get(`${API_BASE_URL}/sources`);
    return response.data;
  },

  async getAuthors() {
    const response = await axios.get(`${API_BASE_URL}/authors`);
    return response.data;
  }
}; 