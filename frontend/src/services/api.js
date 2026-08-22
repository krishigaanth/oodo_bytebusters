/**
 * Dayflow HRMS - Centralized API Service Adapter
 * Interacts with Odoo JSON API (/api/admin/*) with seamless fallback to mock data
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8069';

export const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success !== false) {
          return json.data !== undefined ? json.data : json;
        }
      }
    } catch (err) {
      console.warn(`[Dayflow API] Backend connection to ${endpoint} failed, using local service adapter.`, err.message);
    }
    return null; // Signals caller to use fallback local storage / mock data
  },

  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const json = await response.json();
        if (json.result && json.result.success !== false) {
          return json.result.data || json.result;
        }
        if (json.success !== false) {
          return json.data !== undefined ? json.data : json;
        }
      }
    } catch (err) {
      console.warn(`[Dayflow API] Backend POST to ${endpoint} failed, falling back.`, err.message);
    }
    return null;
  },

  async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const json = await response.json();
        if (json.result && json.result.success !== false) {
          return json.result.data || json.result;
        }
        if (json.success !== false) {
          return json.data !== undefined ? json.data : json;
        }
      }
    } catch (err) {
      console.warn(`[Dayflow API] Backend PUT to ${endpoint} failed, falling back.`, err.message);
    }
    return null;
  }
};
