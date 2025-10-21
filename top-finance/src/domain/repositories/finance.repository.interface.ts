import { Finance } from '../entities/finance.entity';

export interface IFinanceRepository {
  create(finance: Finance): Promise<Finance>;
  findById(id: string): Promise<Finance | null>;
  findByUserId(userId: string, skip?: number, take?: number): Promise<Finance[]>;
  findAll(skip?: number, take?: number): Promise<Finance[]>;
  update(id: string, finance: Partial<Finance>): Promise<Finance>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  count(): Promise<number>;
  countByUserId(userId: string): Promise<number>;
  sumByUserId(userId: string, tipo: string): Promise<number>;
}

