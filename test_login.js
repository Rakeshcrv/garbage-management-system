
const axios = require('axios');

const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Test with admin credentials
login('admin@example.com', 'admin123');

// Test with worker credentials
login('worker@example.com', 'worker123');

// Test with citizen credentials
login('citizen@example.com', 'citizen123');

// Test with invalid credentials
login('invalid@example.com', 'invalid');