// API base URL
const API_URL = 'http://localhost:5000/api';

// Helper function for fetch requests
async function fetchData(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['x-auth-token'] = token;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
}

// API methods
export const api = {
  // Foods
  getFoods: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchData(`/foods${queryString ? `?${queryString}` : ''}`);
  },
  
  getFood: (id) => fetchData(`/foods/${id}`),
  
  // Auth
  register: (userData) => fetchData('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => fetchData('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getCurrentUser: () => fetchData('/auth/me'),
  
  // Orders
  createOrder: (orderData) => fetchData('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getMyOrders: () => fetchData('/orders/my-orders'),
  
  // Restaurants
  getRestaurants: () => fetchData('/restaurants'),
};