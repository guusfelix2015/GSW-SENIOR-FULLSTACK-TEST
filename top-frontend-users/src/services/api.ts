import axios from 'axios';
import type { User, CreateUserDTO, UpdateUserDTO, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get<ApiResponse<User[]>>(`${API_BASE_URL}/users`);
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axios.get<ApiResponse<User>>(`${API_BASE_URL}/users/${id}`);
    return response.data.data as User;
  },

  createUser: async (data: CreateUserDTO): Promise<User> => {
    const response = await axios.post<ApiResponse<User>>(`${API_BASE_URL}/users`, data);
    return response.data.data as User;
  },

  updateUser: async (id: string, data: UpdateUserDTO): Promise<User> => {
    const response = await axios.put<ApiResponse<User>>(`${API_BASE_URL}/users/${id}`, data);
    return response.data.data as User;
  },

  deleteUser: async (id: string): Promise<User> => {
    const response = await axios.delete<ApiResponse<User>>(`${API_BASE_URL}/users/${id}`);
    return response.data.data as User;
  },

  activateUser: async (id: string): Promise<User> => {
    const response = await axios.post<ApiResponse<User>>(`${API_BASE_URL}/users/${id}/activate`);
    return response.data.data as User;
  },

  deactivateUser: async (id: string): Promise<User> => {
    const response = await axios.post<ApiResponse<User>>(`${API_BASE_URL}/users/${id}/deactivate`);
    return response.data.data as User;
  },

  getFinances: async (): Promise<unknown[]> => {
    const response = await axios.get<ApiResponse<unknown[]>>(`${API_BASE_URL}/finances`);
    return (response.data.data as unknown[]) || [];
  },

  getFinanceById: async (id: string): Promise<unknown> => {
    const response = await axios.get<ApiResponse<unknown>>(`${API_BASE_URL}/finances/${id}`);
    return response.data.data || {};
  },

  createFinance: async (data: Record<string, unknown>): Promise<unknown> => {
    const response = await axios.post<ApiResponse<unknown>>(`${API_BASE_URL}/finances`, data);
    return response.data.data || {};
  },

  updateFinance: async (id: string, data: Record<string, unknown>): Promise<unknown> => {
    const response = await axios.put<ApiResponse<unknown>>(`${API_BASE_URL}/finances/${id}`, data);
    return response.data.data || {};
  },

  deleteFinance: async (id: string): Promise<unknown> => {
    const response = await axios.delete<ApiResponse<unknown>>(`${API_BASE_URL}/finances/${id}`);
    return response.data.data || response.data;
  },

  confirmFinance: async (id: string): Promise<unknown> => {
    const response = await axios.post<ApiResponse<unknown>>(`${API_BASE_URL}/finances/${id}/confirm`);
    return response.data.data || response.data;
  },

  cancelFinance: async (id: string): Promise<unknown> => {
    const response = await axios.post<ApiResponse<unknown>>(`${API_BASE_URL}/finances/${id}/cancel`);
    return response.data.data || response.data;
  },

  restoreFinance: async (id: string): Promise<unknown> => {
    const response = await axios.post<ApiResponse<unknown>>(`${API_BASE_URL}/finances/${id}/restore`);
    return response.data.data || response.data;
  },
};

