export class LoginDto {
  email!: string;
  password!: string;
}

export class RegisterDto {
  nome!: string;
  email!: string;
  password!: string;
  endereco!: {
    rua: string;
    numero: string;
    bairro: string;
    complemento?: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export class RefreshTokenDto {
  refreshToken!: string;
}

export class AuthResponseDto {
  success!: boolean;
  data!: {
    user: {
      id: string;
      nome: string;
      email: string;
      status: string;
    };
    token: string;
    refreshToken: string;
  };
}

