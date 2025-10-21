import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { Finance, FinanceType, FinanceStatus } from '@domain/entities/finance.entity';
import { IFinanceRepository } from '@domain/repositories/finance.repository.interface';

@Injectable()
export class FinanceRepository implements IFinanceRepository {
  constructor(@Inject('Knex') private readonly knex: Knex) { }

  async create(finance: Finance): Promise<Finance> {
    await this.knex('finances').insert({
      id: finance.id,
      user_id: finance.userId,
      tipo: finance.tipo,
      descricao: finance.descricao,
      valor: finance.valor,
      status: finance.status,
      data_transacao: finance.dataTransacao,
      data_pagamento: finance.dataPagamento,
      categoria: finance.categoria,
      is_deleted: finance.isDeleted,
      created: finance.created,
      updated: finance.updated,
      deleted: finance.deleted,
    });

    const createdFinance = await this.findById(finance.id);
    if (!createdFinance) {
      throw new Error('Failed to create finance');
    }
    return createdFinance;
  }

  async findById(id: string): Promise<Finance | null> {
    const row = await this.knex('finances').where({ id }).first();

    if (!row) {
      return null;
    }

    return this.mapRowToFinance(row);
  }

  async findByUserId(userId: string, skip: number = 0, take: number = 10): Promise<Finance[]> {
    const rows = await this.knex('finances')
      .where({ user_id: userId, is_deleted: false })
      .offset(skip)
      .limit(take)
      .orderBy('data_transacao', 'desc');

    return rows.map((row) => this.mapRowToFinance(row));
  }

  async findAll(skip: number = 0, take: number = 10): Promise<Finance[]> {
    const rows = await this.knex('finances')
      .where({ is_deleted: false })
      .offset(skip)
      .limit(take)
      .orderBy('data_transacao', 'desc');

    return rows.map((row) => this.mapRowToFinance(row));
  }

  async update(id: string, finance: Partial<Finance>): Promise<Finance> {
    const updateData: Record<string, unknown> = {};

    if (finance.descricao) updateData.descricao = finance.descricao;
    if (finance.valor) updateData.valor = finance.valor;
    if (finance.status) updateData.status = finance.status;
    if (finance.categoria) updateData.categoria = finance.categoria;
    if (finance.dataPagamento !== undefined) updateData.data_pagamento = finance.dataPagamento;
    if (finance.isDeleted !== undefined) updateData.is_deleted = finance.isDeleted;
    if (finance.deleted !== undefined) updateData.deleted = finance.deleted;

    updateData.updated = new Date();

    await this.knex('finances').where({ id }).update(updateData);

    const updatedFinance = await this.findById(id);
    if (!updatedFinance) {
      throw new Error('Failed to update finance');
    }
    return updatedFinance;
  }

  async delete(id: string): Promise<void> {
    await this.knex('finances').where({ id }).update({
      is_deleted: true,
      deleted: new Date(),
      updated: new Date(),
    });
  }

  async restore(id: string): Promise<void> {
    await this.knex('finances').where({ id }).update({
      is_deleted: false,
      deleted: null,
      updated: new Date(),
    });
  }

  async count(): Promise<number> {
    const result = await this.knex('finances')
      .where({ is_deleted: false })
      .count('* as count')
      .first();

    return Number(result?.count) || 0;
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await this.knex('finances')
      .where({ user_id: userId, is_deleted: false })
      .count('* as count')
      .first();

    return Number(result?.count) || 0;
  }

  async sumByUserId(userId: string, tipo: string): Promise<number> {
    const result = await this.knex('finances')
      .where({ user_id: userId, tipo, is_deleted: false, status: FinanceStatus.CONFIRMADA })
      .sum('valor as total')
      .first();

    return Number(result?.total) || 0;
  }

  private mapRowToFinance(row: Record<string, unknown>): Finance {
    return new Finance(
      row.user_id as string,
      row.tipo as FinanceType,
      row.descricao as string,
      Number(row.valor),
      row.categoria as string,
      row.data_transacao as Date,
      row.status as FinanceStatus,
      row.id as string,
      row.is_deleted as boolean,
      row.created as Date,
      row.updated as Date,
      row.deleted as Date | undefined,
    );
  }
}

