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
  endereco?: UserAddress;
  status: 'ativo' | 'inativo';
  created: string;
  updated: string;
}

export interface CreateUserDTO {
  nome: string;
  email: string;
  endereco?: UserAddress;
}

export interface UpdateUserDTO {
  nome?: string;
  email?: string;
  endereco?: UserAddress;
}

export interface Finance {
  id: string;
  userId: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  dataTransacao: string;
  categoria: string;
  status: 'pendente' | 'confirmada' | 'cancelada';
  created: string;
  updated: string;
}

export interface CreateFinanceDTO {
  userId: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  categoria?: string;
  dataTransacao?: string;
}

export interface UpdateFinanceDTO {
  tipo?: 'receita' | 'despesa';
  descricao?: string;
  valor?: number;
  categoria?: string;
  dataTransacao?: string;
}

export interface UserBalance {
  user_id: string;
  total_receita: number;
  total_despesa: number;
  saldo: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

