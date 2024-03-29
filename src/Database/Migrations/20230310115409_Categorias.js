/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("Categoria", (table) => {
        table.increments('id');
        table.string('categoria').notNullable();
        table.string('professorId').notNullable();

        table.foreign('professorId').references('cpf').inTable('User').onDelete("CASCADE");
  
    })
    
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("Categoria");  
};
