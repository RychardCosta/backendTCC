/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("Pergunta", (table) => {
        table.increments('id');
        table.string('pergunta').notNullable();
        table.string('opcao1').notNullable();
        table.string('opcao2').notNullable();
        table.string('opcao3').notNullable();
        table.string('opcao4').notNullable();
        table.string('resposta').notNullable();
        table.integer('valorDaPontuacao').defaultTo(10);
        table.string('categoriaID').notNullable();
        table.string('professorId').notNullable();

        table.foreign('categoriaID').references('id').inTable('Categoria').onDelete("CASCADE");
        table.foreign('professorId').references('cpf').inTable('User').onDelete("CASCADE");

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("Pegunta");  
};
