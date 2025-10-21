import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { User, UserStatus } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@Inject('Knex') private readonly knex: Knex) { }

  async create(user: User): Promise<User> {
    await this.knex('users').insert({
      id: user.id,
      nome: user.nome,
      email: user.email,
      password: user.password,
      rua: user.endereco.rua,
      numero: user.endereco.numero,
      bairro: user.endereco.bairro,
      complemento: user.endereco.complemento,
      cidade: user.endereco.cidade,
      estado: user.endereco.estado,
      cep: user.endereco.cep,
      status: user.status,
      is_deleted: user.isDeleted,
      created: user.created,
      updated: user.updated,
      deleted: user.deleted,
    });

    const createdUser = await this.findById(user.id);
    if (!createdUser) {
      throw new Error('Failed to create user');
    }
    return createdUser;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.knex('users').where({ id }).first();

    if (!row) {
      return null;
    }

    return this.mapRowToUser(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.knex('users').where({ email }).first();

    if (!row) {
      return null;
    }

    return this.mapRowToUser(row);
  }

  async findAll(skip: number = 0, take: number = 10): Promise<User[]> {
    const rows = await this.knex('users')
      .where({ is_deleted: false })
      .offset(skip)
      .limit(take)
      .orderBy('created', 'desc');

    return rows.map((row) => this.mapRowToUser(row));
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const updateData: Record<string, unknown> = {};

    if (user.nome) updateData.nome = user.nome;
    if (user.endereco) {
      updateData.rua = user.endereco.rua;
      updateData.numero = user.endereco.numero;
      updateData.bairro = user.endereco.bairro;
      updateData.complemento = user.endereco.complemento;
      updateData.cidade = user.endereco.cidade;
      updateData.estado = user.endereco.estado;
      updateData.cep = user.endereco.cep;
    }
    if (user.status) updateData.status = user.status;
    if (user.isDeleted !== undefined) updateData.is_deleted = user.isDeleted;
    if (user.deleted !== undefined) updateData.deleted = user.deleted;

    updateData.updated = new Date();

    await this.knex('users').where({ id }).update(updateData);

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.knex('users').where({ id }).update({
      is_deleted: true,
      deleted: new Date(),
      updated: new Date(),
    });
  }

  async restore(id: string): Promise<void> {
    await this.knex('users').where({ id }).update({
      is_deleted: false,
      deleted: null,
      updated: new Date(),
    });
  }

  async count(): Promise<number> {
    const result = await this.knex('users')
      .where({ is_deleted: false })
      .count('* as count')
      .first();

    return Number(result?.count) || 0;
  }

  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    let query = this.knex('users').where({ email, is_deleted: false });

    if (excludeId) {
      query = query.whereNot({ id: excludeId });
    }

    const result = await query.first();
    return !!result;
  }

  private mapRowToUser(row: any): User {
    return new User(
      row.nome,
      row.email,
      {
        rua: row.rua,
        numero: row.numero,
        bairro: row.bairro,
        complemento: row.complemento,
        cidade: row.cidade,
        estado: row.estado,
        cep: row.cep,
      },
      row.password || '',
      row.status as UserStatus,
      row.id,
      row.is_deleted,
      row.created,
      row.updated,
      row.deleted,
    );
  }
}

