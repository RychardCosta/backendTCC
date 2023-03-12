/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("PerguntasRespondidas", (table) => {
        table.increments('id');
        table.string('perguntaId').notNullable();
        table.string('respostaEscolhida').notNullable();
        table.string('alunoId').notNullable();
        table.string('professorId').notNullable();
       
        table.foreign('perguntaId').references('id').inTable('Pergunta').onDelete("CASCADE");
        table.foreign('alunoId').references('cpf').inTable('User').onDelete("CASCADE");
        table.foreign('professorId').references('professorId').inTable('User').onDelete("CASCADE");

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("PerguntasRespondidas");  
  
};
