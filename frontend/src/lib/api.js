const API_URL = import.meta.env.PROD 
  ? 'https://food-delivery-api-am5l.onrender.com/api'
  : 'http://localhost:5000/api';

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

export const api = {
  getFoods: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchData(`/foods${queryString ? `?${queryString}` : ''}`);
  },
  
  getFood: (id) => fetchData(`/foods/${id}`),
  
  register: (userData) => fetchData('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => fetchData('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getCurrentUser: () => fetchData('/auth/me'),
  
  createOrder: (orderData) => fetchData('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getMyOrders: () => fetchData('/orders/my-orders'),
  
  getRestaurants: () => fetchData('/restaurants'),
};