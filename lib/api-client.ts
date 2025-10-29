import axios from "axios";

// Use local Next.js API routes instead of external backend
const API_URL = "/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products API
export const productsApi = {
  getAll: async (params?: any) => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },
  
  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get(`/products/${slug}`);
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/categories');
    return data;
  },
};

// Orders API
export const ordersApi = {
  create: async (orderData: any) => {
    const { data } = await apiClient.post('/orders', orderData);
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/orders/${id}`);
    return data;
  },
};
