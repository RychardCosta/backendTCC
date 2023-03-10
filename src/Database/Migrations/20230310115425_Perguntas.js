/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("Pegunta", (table) => {
        table.increments('id');
        table.string('pergunta').notNullable();
        table.string('categoriaID').notNullable();
        table.string('professorID').notNullable();

        table.foreign('categoriaID').references('id').inTable('Categoria');
        table.foreign('professorID').references('id').inTable('User');

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("Pegunta");  
};
