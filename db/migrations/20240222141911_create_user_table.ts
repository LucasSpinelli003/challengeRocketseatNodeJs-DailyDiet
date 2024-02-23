import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tb_users', (table) => {
        table.uuid('id').primary();
        table.text('name').notNullable();
        table.text('login').notNullable();
        table.text('password').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tb_users');
}
