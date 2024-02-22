import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tb_meal', (table) => {
        table.uuid('id').primary();
        table.text('name').notNullable();
        table.text('description').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
        table.text('type').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tb_meal');
}
