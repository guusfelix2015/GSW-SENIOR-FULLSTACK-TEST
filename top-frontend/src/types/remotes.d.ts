import type { ApiService } from '../services/api';

interface UserData {
  id: string;
  nome: string;
  email: string;
  status: string;
  endereco?: {
    rua: string;
    numero: string;
    bairro: string;
    complemento?: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

declare module 'topFrontendUsers/UserList' {
  import React from 'react';
  interface UserListProps {
    apiService?: ApiService;
  }
  const UserList: React.FC<UserListProps>;
  export default UserList;
}

declare module 'topFrontendUsers/UserForm' {
  import React from 'react';
  interface UserFormProps {
    onSubmit: (data: UserData) => Promise<void>;
    onCancel: () => void;
    apiService: ApiService;
    initialData?: UserData;
    isLoading?: boolean;
  }
  const UserForm: React.FC<UserFormProps>;
  export default UserForm;
}

declare module 'topFrontendUsers/UserDetail' {
  import React from 'react';
  interface UserDetailProps {
    userId: string;
    apiService: ApiService;
    onBack?: () => void;
  }
  const UserDetail: React.FC<UserDetailProps>;
  export default UserDetail;
}

interface FinanceData {
  id?: string;
  user_id?: string;
  valor: number;
  descricao: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

declare module 'topFrontendFinance/FinanceList' {
  import React from 'react';
  interface FinanceListProps {
    apiService?: ApiService;
  }
  const FinanceList: React.FC<FinanceListProps>;
  export default FinanceList;
}

declare module 'topFrontendFinance/FinanceForm' {
  import React from 'react';
  interface FinanceFormProps {
    onSubmit: (data: FinanceData) => Promise<void>;
    onCancel: () => void;
    apiService: ApiService;
    initialData?: FinanceData;
    isLoading?: boolean;
  }
  const FinanceForm: React.FC<FinanceFormProps>;
  export default FinanceForm;
}

declare module 'topFrontendFinance/FinanceDetail' {
  import React from 'react';
  interface FinanceDetailProps {
    financeId: string;
    apiService: ApiService;
    onBack?: () => void;
  }
  const FinanceDetail: React.FC<FinanceDetailProps>;
  export default FinanceDetail;
}

