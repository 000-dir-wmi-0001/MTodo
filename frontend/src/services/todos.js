import axios from 'axios';

// Create an axios instance to centralize config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/', // The base URL for your API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define the TodoDataService class
class TodoDataService {
  constructor() {
    // Add an interceptor to set Authorization header globally
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token'); // Getting token from localStorage
        if (token) {
          config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Fetch all todos
  getAll() {
    // Send a GET request to fetch all todos
    return axiosInstance.get('todos/');
  }

  // Create a new todo
  create(data) {
    // Send a POST request to create a new todo
    return axiosInstance.post('todos/', data);
  }

  // Update an existing todo
  update(id, data) {
    // Send a PUT request to update a specific todo by ID
    return axiosInstance.put(`todos/${id}/`, data);
  }

  // Delete a todo
  delete(id) {
    // Send a DELETE request to remove a specific todo by ID
    return axiosInstance.delete(`todos/${id}/`);
  }

  // Mark a todo as completed
  complete(id) {
    // Send a PUT request to mark a todo as completed
    return axiosInstance.put(`todos/${id}/complete/`);
  }

  // Login function
  login(data) {
    // Send a POST request to the login endpoint
    return axiosInstance.post('login/', data);
  }

  // Signup function
  signup(data) {
    // Send a POST request to the signup endpoint
    return axiosInstance.post('signup/', data);
  }
}

// Export an instance of the service
export default new TodoDataService();
