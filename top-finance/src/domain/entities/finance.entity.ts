import { v4 as uuidv4 } from 'uuid';

export enum FinanceType {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

export enum FinanceStatus {
  PENDENTE = 'pendente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
}

export class Finance {
  id: string;
  userId: string;
  tipo: FinanceType;
  descricao: string;
  valor: number;
  status: FinanceStatus;
  dataTransacao: Date;
  dataPagamento?: Date;
  categoria: string;
  isDeleted: boolean;
  created: Date;
  updated: Date;
  deleted?: Date;

  constructor(
    userId: string,
    tipo: FinanceType,
    descricao: string,
    valor: number,
    categoria: string,
    dataTransacao: Date = new Date(),
    status: FinanceStatus = FinanceStatus.PENDENTE,
    id: string = uuidv4(),
    isDeleted: boolean = false,
    created: Date = new Date(),
    updated: Date = new Date(),
    deleted?: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
    this.status = status;
    this.dataTransacao = dataTransacao;
    this.categoria = categoria;
    this.isDeleted = isDeleted;
    this.created = created;
    this.updated = updated;
    this.deleted = deleted;
  }

  confirm(): void {
    if (this.isDeleted) {
      throw new Error('Cannot confirm a deleted transaction');
    }

    if (this.status === FinanceStatus.CANCELADA) {
      throw new Error('Cannot confirm a cancelled transaction');
    }

    this.status = FinanceStatus.CONFIRMADA;
    this.dataPagamento = new Date();
    this.updated = new Date();
  }

  cancel(): void {
    if (this.isDeleted) {
      throw new Error('Cannot cancel a deleted transaction');
    }

    if (this.status === FinanceStatus.CONFIRMADA) {
      throw new Error('Cannot cancel a confirmed transaction');
    }

    this.status = FinanceStatus.CANCELADA;
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

  updateDescription(descricao: string): void {
    if (this.isDeleted) {
      throw new Error('Cannot update description of a deleted transaction');
    }

    if (!descricao || descricao.trim().length === 0) {
      throw new Error('Description cannot be empty');
    }

    this.descricao = descricao;
    this.updated = new Date();
  }

  updateValue(valor: number): void {
    if (this.isDeleted) {
      throw new Error('Cannot update value of a deleted transaction');
    }

    if (valor <= 0) {
      throw new Error('Value must be greater than zero');
    }

    if (this.status === FinanceStatus.CONFIRMADA) {
      throw new Error('Cannot update value of a confirmed transaction');
    }

    this.valor = valor;
    this.updated = new Date();
  }

  updateCategory(categoria: string): void {
    if (this.isDeleted) {
      throw new Error('Cannot update category of a deleted transaction');
    }

    if (!categoria || categoria.trim().length === 0) {
      throw new Error('Category cannot be empty');
    }

    this.categoria = categoria;
    this.updated = new Date();
  }

  isConfirmed(): boolean {
    return this.status === FinanceStatus.CONFIRMADA && !this.isDeleted;
  }

  isCancelled(): boolean {
    return this.status === FinanceStatus.CANCELADA;
  }

  isDeleted_(): boolean {
    return this.isDeleted;
  }

  isIncome(): boolean {
    return this.tipo === FinanceType.RECEITA;
  }

  isExpense(): boolean {
    return this.tipo === FinanceType.DESPESA;
  }
}

