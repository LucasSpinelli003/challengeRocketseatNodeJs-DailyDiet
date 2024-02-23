import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('tb_meal', (table) =>{
        table.text('id_user').unsigned();   
        table.foreign('id_user').references('tb_users.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('tb_meal', (table) =>{
        table.dropColumn('id_user')
    })
}

