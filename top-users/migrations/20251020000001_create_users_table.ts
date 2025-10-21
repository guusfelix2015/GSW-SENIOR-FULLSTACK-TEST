import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.string('nome', 255).notNullable();
    table.string('email', 255).notNullable().unique();

    table.string('rua', 255);
    table.string('numero', 20);
    table.string('bairro', 100);
    table.string('complemento', 255);
    table.string('cidade', 100);
    table.string('estado', 2);
    table.string('cep', 10);

    table
      .enum('status', ['ativo', 'inativo'], {
        useNative: true,
        enumName: 'user_status_enum',
      })
      .defaultTo('ativo');

    table.boolean('is_deleted').defaultTo(false);

    table.timestamp('created').defaultTo(knex.fn.now());
    table.timestamp('updated').defaultTo(knex.fn.now());
    table.timestamp('deleted').nullable();

    table.index('status');
    table.index('is_deleted');
    table.index('email');
    table.index('created');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  await knex.raw('DROP TYPE IF EXISTS user_status_enum');
}

