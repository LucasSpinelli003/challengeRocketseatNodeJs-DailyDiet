import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tb_users', (table) => {
        table.uuid('id').primary();
        table.text('name').notNullable();
        table.text('login').notNullable();
        table.text('password').notNullable();
        table.text('id_meal').unsigned();   
        table.foreign('id_meal').references('tb_meal.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tb_users');
}
