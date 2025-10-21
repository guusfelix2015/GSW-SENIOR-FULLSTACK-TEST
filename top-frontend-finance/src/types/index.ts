export interface Finance {
  id: string;
  userId: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  dataTransacao: string;
  status: 'pendente' | 'confirmada' | 'cancelada';
  created: string | Date;
  updated: string | Date;
}

export interface CreateFinanceDTO {
  userId: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  dataTransacao: string;
}

export interface UpdateFinanceDTO {
  tipo?: 'receita' | 'despesa';
  descricao?: string;
  valor?: number;
  dataTransacao?: string;
}

export interface UserBalance {
  user_id: string;
  total_receita: number;
  total_despesa: number;
  saldo: number;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  status: 'ativo' | 'inativo';
  endereco?: {
    rua: string;
    numero: string;
    bairro: string;
    complemento?: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  created: string;
  updated: string;
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

