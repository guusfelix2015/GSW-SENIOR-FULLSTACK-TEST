import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  Finance,
  CreateFinanceDTO,
  UpdateFinanceDTO,
  UserBalance,
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationParams,
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_refresh_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }

        const apiError: ApiError = {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  async getUsers(): Promise<User[]> {
    const response = await this.api.get<ApiResponse<User[]>>('/users');
    return Array.isArray(response.data.data) ? response.data.data : [];
  }

  async getUsersPaginated(params: PaginationParams = {}): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10, sortBy = 'created', sortOrder = 'desc' } = params;
    const response = await this.api.get<ApiResponse<User[]>>('/users', {
      params: { page, limit, sortBy, sortOrder },
    });
    const data = Array.isArray(response.data.data) ? response.data.data : [];
    return { success: response.data.success, data, total: data.length, page, limit };
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data as User;
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const response = await this.api.post<ApiResponse<User>>('/users', data);
    return response.data.data as User;
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    const response = await this.api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data as User;
  }

  async deactivateUser(id: string): Promise<User> {
    const response = await this.api.post<ApiResponse<User>>(`/users/${id}/deactivate`);
    return response.data.data as User;
  }

  async activateUser(id: string): Promise<User> {
    const response = await this.api.post<ApiResponse<User>>(`/users/${id}/activate`);
    return response.data.data as User;
  }

  async deleteUser(id: string): Promise<User> {
    const response = await this.api.delete<ApiResponse<User>>(`/users/${id}`);
    return response.data.data as User;
  }

  async restoreUser(id: string): Promise<User> {
    const response = await this.api.post<ApiResponse<User>>(`/users/${id}/restore`);
    return response.data.data!;
  }

  async getFinances(): Promise<Finance[]> {
    const response = await this.api.get<ApiResponse<Finance[]>>('/finances');
    return Array.isArray(response.data.data) ? response.data.data : [];
  }

  async getFinancesPaginated(params: PaginationParams = {}): Promise<PaginatedResponse<Finance>> {
    const { page = 1, limit = 10, sortBy = 'dataTransacao', sortOrder = 'desc' } = params;
    const response = await this.api.get<ApiResponse<Finance[]>>('/finances', {
      params: { page, limit, sortBy, sortOrder },
    });
    const data = Array.isArray(response.data.data) ? response.data.data : [];
    return { success: response.data.success, data, total: data.length, page, limit };
  }

  async getFinanceById(id: string): Promise<Finance> {
    const response = await this.api.get<ApiResponse<Finance>>(`/finances/${id}`);
    return response.data.data as Finance;
  }

  async getUserFinances(userId: string): Promise<Finance[]> {
    const response = await this.api.get<ApiResponse<Finance[]>>(`/finances/user/${userId}`);
    return Array.isArray(response.data.data) ? response.data.data : [];
  }

  async getUserBalance(userId: string): Promise<UserBalance> {
    const response = await this.api.get<ApiResponse<UserBalance>>(`/finances/user/${userId}/balance`);
    return response.data.data as UserBalance;
  }

  async createFinance(data: CreateFinanceDTO): Promise<Finance> {
    const response = await this.api.post<ApiResponse<Finance>>('/finances', data);
    return response.data.data as Finance;
  }

  async updateFinance(id: string, data: UpdateFinanceDTO): Promise<Finance> {
    const response = await this.api.put<ApiResponse<Finance>>(`/finances/${id}`, data);
    return response.data.data as Finance;
  }

  async confirmFinance(id: string): Promise<Finance> {
    const response = await this.api.post<ApiResponse<Finance>>(`/finances/${id}/confirm`);
    return response.data.data as Finance;
  }

  async cancelFinance(id: string): Promise<Finance> {
    const response = await this.api.post<ApiResponse<Finance>>(`/finances/${id}/cancel`);
    return response.data.data as Finance;
  }

  async deleteFinance(id: string): Promise<Finance> {
    const response = await this.api.delete<ApiResponse<Finance>>(`/finances/${id}`);
    return response.data.data as Finance;
  }
}

export const apiService = new ApiService();

