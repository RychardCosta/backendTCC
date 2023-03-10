/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("User", (table) => {
        table.string('cpf').primary();
        table.string('nome').notNullable();
        table.string('sobrenome').notNullable();
        table.string('senha').notNullable();
        table.string('tipoDeConta').notNullable();
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
