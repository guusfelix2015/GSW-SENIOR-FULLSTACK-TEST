import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('finances', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('user_id').notNullable();

    table.decimal('valor', 15, 2).notNullable();
    table.string('descricao', 500);
    table.string('categoria', 100);

    table.enum('tipo', ['receita', 'despesa'], {
      useNative: true,
      enumName: 'finance_type_enum',
    }).notNullable();

    table.enum('status', ['pendente', 'confirmada', 'cancelada'], {
      useNative: true,
      enumName: 'finance_status_enum',
    }).defaultTo('pendente');

    table.timestamp('data_transacao').defaultTo(knex.fn.now());
    table.timestamp('data_pagamento').nullable();

    table.boolean('is_deleted').defaultTo(false);

    table.timestamp('created').defaultTo(knex.fn.now());
    table.timestamp('updated').defaultTo(knex.fn.now());
    table.timestamp('deleted').nullable();

    table.index('user_id');
    table.index('is_deleted');
    table.index('created');
    table.index('tipo');
    table.index('status');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('finances');
  await knex.raw('DROP TYPE IF EXISTS finance_type_enum');
  await knex.raw('DROP TYPE IF EXISTS finance_status_enum');
}

