// API service to connect with Spring Boot backend
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for handling requests
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || `Server responded with status: ${error.response.status}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Request error:', error.message);
      throw error;
    }
  }
);

// Check if the API is available
export async function checkApiAvailability(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.warn('API server is not available:', error);
    return false;
  }
}

// Generic function to fetch data
export async function fetchData<T>(endpoint: string, options?: any): Promise<T | null> {
  try {
    const response = await api.get(endpoint, options);
    return response as T;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
}

// Generic function to post data
export async function postData<T>(endpoint: string, data: any, options?: any): Promise<T | null> {
  try {
    const response = await api.post(endpoint, data, options);
    return response as T;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    return null;
  }
}

// Generic function to update data with PUT method
export async function putData<T>(endpoint: string, data: any, options?: any): Promise<T | null> {
  try {
    const response = await api.put(endpoint, data, options);
    return response as T;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    return null;
  }
}

// Generic function to delete data
export async function deleteData<T>(endpoint: string, options?: any): Promise<T | null> {
  try {
    const response = await api.delete(endpoint, options);
    return response as T;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    return null;
  }
}

// Export the axios instance for direct use if needed
export default api;

interface Supplier {
  supplier_id: number
  company: string
  contact_person: string
  email: string
  mobile: string
  address: string
  status: "Active" | "Inactive" | "Pending"
  categories: string
}

interface SupplierName {
  company: string
}

// API service with methods for each endpoint
export const apiService = {
  // Inventory endpoints
  getInventoryItems: async () => {
    return fetchData("/inventory")
  },
  getInventoryItem: async (id: string) => {
    return fetchData(`/inventory/${id}`)
  },
  createInventoryItem: async (data: any) => {
    return postData("/inventory", data)
  },
  updateInventoryItem: async (id: string, data: any) => {
    return putData(`/inventory/${id}`, data)
  },
  deleteInventoryItem: async (id: string) => {
    return deleteData(`/inventory/${id}`)
  },

  // Recipe endpoints
  getRecipes: async () => {
    return fetchData("/recipes")
  },
  getRecipe: async (id: string) => {
    return fetchData(`/recipes/${id}`)
  },
  createRecipe: async (data: any) => {
    return postData("/recipes", data)
  },
  updateRecipe: async (id: string, data: any) => {
    return putData(`/recipes/${id}`, data)
  },
  deleteRecipe: async (id: string) => {
    return deleteData(`/recipes/${id}`)
  },

  // Order endpoints
  getOrders: async () => {
    return fetchData("/orders")
  },
  getOrder: async (id: string) => {
    return fetchData(`/orders/${id}`)
  },
  createOrder: async (data: any) => {
    return postData("/orders", data)
  },
  updateOrder: async (id: string, data: any) => {
    return putData(`/orders/${id}`, data)
  },
  deleteOrder: async (id: string) => {
    return deleteData(`/orders/${id}`)
  },

  // Supplier endpoints
  getSuppliers: async () => {
    return fetchData<Supplier[]>('/supplier/getAll')
  },
  getSupplierNames: async () => {
    return fetchData<SupplierName[]>('/supplier/names')
  },
  postSupplier: async (data: any) => {
    return postData('/supplier/save', data)
  },

  // Analytics endpoints
  getAnalyticsSummary: async (timeframe: string) => {
    return fetchData(`/analytics/summary?timeframe=${timeframe}`)
  },
  getInventoryUsageData: async (timeframe: string) => {
    return fetchData(`/analytics/usage?timeframe=${timeframe}`)
  },
  getCategoryBreakdownData: async () => {
    return fetchData("/analytics/categories")
  },
  getTopItems: async () => {
    return fetchData("/analytics/top-items")
  },

  // Authentication endpoints
  login: async (credentials: { username: string; password: string }) => {
    return postData("/auth/login", credentials)
  },
  logout: async () => {
    return postData("/auth/logout", {})
  },
  getCurrentUser: async () => {
    return fetchData("/auth/user")
  },
}

