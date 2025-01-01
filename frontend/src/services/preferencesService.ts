import axios from 'axios';
import { API_BASE_URL } from '../config';
import { User } from '../types';

export const preferencesService = {
  async getPreferences() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/preferences`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  },

  async savePreferences(preferences: User['preferences']) {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/preferences`, 
      { preferences: JSON.stringify(preferences) },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
}; 