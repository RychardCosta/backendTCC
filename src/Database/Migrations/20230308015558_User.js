/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("User", (table) => {
        table.string('CPF').primary();
        table.string('name').notNullable();
        table.string('password').notNullable();
        table.string('lastName').notNullable();
        table.string('accountType').notNullable();
        table.string('pontuacao').notNullable();
        table.string('professorID');


    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("User");  

  
};
