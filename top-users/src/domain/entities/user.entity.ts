import { v4 as uuidv4 } from 'uuid';

export enum UserStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

export interface UserAddress {
  rua: string;
  numero: string;
  bairro: string;
  complemento?: string;
  cidade: string;
  estado: string;
  cep: string;
}

export class User {
  id: string;
  nome: string;
  email: string;
  password: string;
  endereco: UserAddress;
  status: UserStatus;
  isDeleted: boolean;
  created: Date;
  updated: Date;
  deleted?: Date;

  constructor(
    nome: string,
    email: string,
    endereco: UserAddress,
    password: string = '',
    status: UserStatus = UserStatus.ATIVO,
    id?: string,
    isDeleted: boolean = false,
    created?: Date,
    updated?: Date,
    deleted?: Date,
  ) {
    this.id = id || uuidv4();
    this.nome = nome;
    this.email = email;
    this.password = password;
    this.endereco = endereco;
    this.status = status;
    this.isDeleted = isDeleted;
    this.created = created || new Date();
    this.updated = updated || new Date();
    this.deleted = deleted;
  }

  activate(): void {
    if (this.isDeleted) {
      throw new Error('Cannot activate a deleted user');
    }
    this.status = UserStatus.ATIVO;
    this.updated = new Date();
  }

  deactivate(): void {
    if (this.isDeleted) {
      throw new Error('Cannot deactivate a deleted user');
    }
    this.status = UserStatus.INATIVO;
    this.updated = new Date();
  }

  softDelete(): void {
    this.isDeleted = true;
    this.deleted = new Date();
    this.updated = new Date();
  }

  restore(): void {
    this.isDeleted = false;
    this.deleted = undefined;
    this.updated = new Date();
  }

  updateAddress(endereco: UserAddress): void {
    if (this.isDeleted) {
      throw new Error('Cannot update address of a deleted user');
    }
    this.endereco = endereco;
    this.updated = new Date();
  }

  updateName(nome: string): void {
    if (this.isDeleted) {
      throw new Error('Cannot update name of a deleted user');
    }
    if (!nome || nome.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.nome = nome;
    this.updated = new Date();
  }

  isActive(): boolean {
    return this.status === UserStatus.ATIVO && !this.isDeleted;
  }

  isDeleted_(): boolean {
    return this.isDeleted;
  }

  setPassword(hashedPassword: string): void {
    if (!hashedPassword || hashedPassword.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }
    this.password = hashedPassword;
    this.updated = new Date();
  }

  hasPassword(): boolean {
    return !!this.password && this.password.length > 0;
  }
}

