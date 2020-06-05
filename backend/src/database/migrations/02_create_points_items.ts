import Knex from 'knex'

export async function up(knex: Knex) {
    // Criar tabelas
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();
        table.integer('point_id').notNullable().references('id').inTable('point');
        table.integer('items_id').notNullable().references('id').inTable('items');
    })
}

export async function down(knex: Knex) {
    // Voltar atrás
    return knex.schema.dropTable('point_items');
}