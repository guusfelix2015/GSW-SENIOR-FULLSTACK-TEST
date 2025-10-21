export interface UserAddress {
  rua: string;
  numero: string;
  bairro: string;
  complemento?: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  endereco: UserAddress;
  status: 'ativo' | 'inativo';
  created: string | Date;
  updated: string | Date;
}

export interface CreateUserDTO {
  nome: string;
  email: string;
  endereco: UserAddress;
}

export interface UpdateUserDTO {
  nome?: string;
  email?: string;
  endereco?: UserAddress;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

