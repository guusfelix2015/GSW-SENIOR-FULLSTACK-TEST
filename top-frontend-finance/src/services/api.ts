import axios from 'axios';
import type { User, CreateFinanceDTO, UpdateFinanceDTO, Finance, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get<ApiResponse<User[]>>(`${API_BASE_URL}/users`);
    return response.data.data || [];
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axios.get<ApiResponse<User>>(`${API_BASE_URL}/users/${id}`);
    return response.data.data!;
  },

  createUser: async (data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>): Promise<User> => {
    const response = await axios.post<ApiResponse<User>>(`${API_BASE_URL}/users`, data);
    return response.data.data!;
  },

  updateUser: async (id: string, data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>>): Promise<User> => {
    const response = await axios.put<ApiResponse<User>>(`${API_BASE_URL}/users/${id}`, data);
    return response.data.data!;
  },

  deleteUser: async (id: string): Promise<User> => {
    const response = await axios.delete<ApiResponse<User>>(`${API_BASE_URL}/users/${id}`);
    return response.data.data!;
  },

  activateUser: async (id: string): Promise<User> => {
    const response = await axios.patch<ApiResponse<User>>(`${API_BASE_URL}/users/${id}/activate`);
    return response.data.data!;
  },

  deactivateUser: async (id: string): Promise<User> => {
    const response = await axios.patch<ApiResponse<User>>(`${API_BASE_URL}/users/${id}/deactivate`);
    return response.data.data!;
  },

  getFinances: async (): Promise<Finance[]> => {
    const response = await axios.get<ApiResponse<Finance[]>>(`${API_BASE_URL}/finances`);
    return response.data.data || [];
  },

  getFinanceById: async (id: string): Promise<Finance> => {
    const response = await axios.get<ApiResponse<Finance>>(`${API_BASE_URL}/finances/${id}`);
    return response.data.data!;
  },

  createFinance: async (data: CreateFinanceDTO): Promise<Finance> => {
    const response = await axios.post<ApiResponse<Finance>>(`${API_BASE_URL}/finances`, data);
    return response.data.data!;
  },

  updateFinance: async (id: string, data: UpdateFinanceDTO): Promise<Finance> => {
    const response = await axios.put<ApiResponse<Finance>>(`${API_BASE_URL}/finances/${id}`, data);
    return response.data.data!;
  },

  deleteFinance: async (id: string): Promise<Finance> => {
    const response = await axios.delete<ApiResponse<Finance>>(`${API_BASE_URL}/finances/${id}`);
    return response.data.data!;
  },

  confirmFinance: async (id: string): Promise<Finance> => {
    const response = await axios.post<ApiResponse<Finance>>(`${API_BASE_URL}/finances/${id}/confirm`);
    return response.data.data!;
  },

  cancelFinance: async (id: string): Promise<Finance> => {
    const response = await axios.post<ApiResponse<Finance>>(`${API_BASE_URL}/finances/${id}/cancel`);
    return response.data.data!;
  },

  restoreFinance: async (id: string): Promise<Finance> => {
    const response = await axios.post<ApiResponse<Finance>>(`${API_BASE_URL}/finances/${id}/restore`);
    return response.data.data!;
  },
};

