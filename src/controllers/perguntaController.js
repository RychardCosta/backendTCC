const connection = require("..//Database/connection");

module.exports = {
  async create(req, res) {
    const {
      pergunta,
      resposta,
      categoriaName,
      professorId,
      opcao1,
      opcao2,
      opcao3,
      opcao4,
    } = req.body;
    console.log(categoriaName.toUpperCase());
    try {
      const categoriaId = await connection("Categoria")
        .select("*")
        .where({ professorId })
        .andWhere("categoria", categoriaName.toUpperCase())
        .first();
      console.log(categoriaId);
      const perguntaDB = await connection("Pergunta")
        .select("*")
        .where({ pergunta: pergunta, professorId: professorId })
        .first();
      if (perguntaDB) {
        res.json({
          message: "Pergunta ja cadastrada",
        });
      } else {
        const newPergunta = connection("Pergunta")
          .insert({
            pergunta,
            resposta,
            categoriaId: categoriaId.id,
            professorId,
            opcao1,
            opcao2,
            opcao3,
            opcao4,
          })
          .then(() => console.log("Pergunta cadastrado com sucesso!"))
          .catch((err) => console.error(err));
        const perguntaSearch = await connection("Pergunta")
          .select("*")
          .where("pergunta", pergunta)
          .first();

        res.json({
          message: "Pergunta cadastrada com sucesso!",
          pergunta: perguntaSearch,
        });
        connection.destroy;
      }
    } catch (error) {
      console.log(error);
      res.json({
        message: "Error",
      });
    }
  },
  async index(req, res) {
    const { professorId } = req.params;
    const { id } = req.query;

    try {
      if (id) {
        const perguntaSearch = await connection("Pergunta")
          .select("*")
          .where({ id: id, professorId: professorId });
        res.json({
          pergunta: perguntaSearch,
        });
      } else {
        const perguntaSearch = await connection("Pergunta")
          .select("*")
          .where("professorId", professorId);
        res.json({
          pergunta: perguntaSearch,
        });
      }
    } catch (error) {
      res.json({
        message: "Nenhuma pergunta encontrada",
      });
    }
  },
  async responderPergunta(req, res) {
    const { perguntaId } = req.params;
    const { respostaEscolhida, alunoId } = req.body;

    try {
      const perguntaSearch = await connection("Pergunta")
        .select("*")
        .where("id", perguntaId)
        .first();
      const perguntaRespondidaSearch = await connection("PerguntasRespondidas")
        .select("*")
        .where({ perguntaId: perguntaId, alunoId: alunoId })
        .andWhere("pontosObtidos", ">", "0");
      const user = await connection("User")
        .select("*")
        .where("cpf", alunoId)
        .first();
      console.log(perguntaRespondidaSearch);

      if (!user) {
        res.json({
          message: "Usuário não encontrado!",
        });
      } else {
        if (respostaEscolhida === perguntaSearch.resposta) {
          await connection("PerguntasRespondidas")
            .insert({
              perguntaId,
              respostaEscolhida,
              alunoId,
              professorId: user.professorId,
              pontosObtidos: perguntaSearch.valorDaPontuacao,
            })
            .then(() => console.log("Log de resposta cadastrado com sucesso!"))
            .catch((err) => console.error(err));

          const respostaSearch = await connection("PerguntasRespondidas")
            .select("*")
            .where({ alunoId, perguntaId })
            .first();

          if (perguntaRespondidaSearch.length === 0) {
            await connection("User")
              .update(
                "pontuacao",
                user.pontuacao + perguntaSearch.valorDaPontuacao
              )
              .where("cpf", user.cpf)
              .then(() =>
                console.log(
                  `Pontuação registrada com sucesso: ${user.pontuacao + perguntaSearch.valorDaPontuacao
                  }`
                )
              )
              .catch((err) => console.error(err));
          } else {
            console.log("Sem atualização");
          }

          res.json({
            message: "Resposta certa!",
            resposta: respostaSearch,
          });
        } else {
          await connection("PerguntasRespondidas")
            .insert({
              perguntaId,
              respostaEscolhida,
              alunoId,
              professorId: user.professorId,
              pontosObtidos: 0,
            })
            .then(() => console.log("Log de resposta cadastrado com sucesso!"))
            .catch((err) => console.error(err));
          res.json({
            message: "Resposta errada!.",
          });
        }
      }
      connection.destroy;
    } catch (error) {
      res.json({ message: "Error" });
      console.log(error);
    }
  },
  async gerar(req, res) {
    const { professorId } = req.params;
    const { verificarPerguntasRepetidas, alunoId, categoriaID } = req.query;

    if (verificarPerguntasRepetidas === "true" && alunoId) {
      try {
        console.log("Verificar perrgunta");
        const perguntasRespondidasSearch = await connection(
          "PerguntasRespondidas"
        )
          .select("*")
          .where("alunoId", alunoId)
          .whereNot("pontosObtidos", 0);
        console.log(perguntasRespondidasSearch);

        const arrayId = [];
        console.log(perguntasRespondidasSearch);

        for (pergunta of perguntasRespondidasSearch) {
          arrayId.push(pergunta.perguntaId);
          console.log(pergunta.perguntaId);
        }

        const searchPerguntasFiltradas = await connection("Pergunta")
          .select("*")
          .whereNotIn("id", arrayId)
          .where({ categoriaID });

        if (searchPerguntasFiltradas.length === 0) {
          const perguntas = await connection("Pergunta")
            .select("*")
            .where({ professorId, categoriaID });

          res.json({
            message:
              "Todas as perguntas já foram respondidas. Pergunta a seguir não valendo pontuação",
            perguntas: shuffleArray(perguntas),
          });
          console.log("PErguntas geradas com sucesso");
        } else {
          res.json({
            message: "Pergunta valendo pontuação.",
            perguntas: shuffleArray(searchPerguntasFiltradas),
          });
          console.log("PErguntas geradas com sucesso");
        }
      } catch (error) {
        console.log(error);
        res.json({ message: "Error." });
      }
    } else {
      try {
        const perguntas = await connection("Pergunta")
          .select("*")
          .where({ professorId, categoriaID });

        res.json({
          message: "Pergunta valendo pontuação.",
          perguntas: shuffleArray(perguntas),
        });
        console.log("PErguntas geradas com sucesso");
      } catch (error) {
        console.log(error);
        res.json({ message: "Error." });
      }
    }

    function shuffleArray(arr) {
      // Loop em todos os elementos
      for (let i = arr.length - 1; i > 0; i--) {
        // Escolhendo elemento aleatório
        const j = Math.floor(Math.random() * (i + 1));
        // Reposicionando elemento
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      // Retornando array com aleatoriedade
      return arr;
    }
  },
  async update(req, res) {
    const { perguntaId } = req.params;
    const {
      newCategoria,
      novaPergunta,
      novaResposta,
      novaOpcao1,
      novaOpcao2,
      novaOpcao3,
      novaOpcao4,
    } = req.body;
    let message;
    console.log(newCategoria)


    try {
      const pergunta = await connection("Pergunta")
        .select("*")
        .where("pergunta", novaPergunta);

      if (pergunta.length === 0) {
        await connection("Pergunta")
          .update("pergunta", novaPergunta)
          .where("id", perguntaId);
        console.log("Pergunta");
      } else {
        message = "Pergunta já cadastrada"
      }


      if (newCategoria) {
        const categoria = await connection("Categoria")
          .where("categoria", newCategoria)
          .first();
        await connection("Pergunta")
          .update("categoriaId", categoria.id)
          .where("id", perguntaId);
        console.log(categoria.id);
      }
      if (novaResposta) {
        await connection("Pergunta")
          .update("resposta", novaResposta)
          .where("id", perguntaId);
      }
      if (novaOpcao1) {
        await connection("Pergunta")
          .update("opcao1", novaOpcao1)
          .where("id", perguntaId);
      }
      if (novaOpcao2) {
        await connection("Pergunta")
          .update("opcao2", novaOpcao2)
          .where("id", perguntaId);
      }
      if (novaOpcao3) {
        await connection("Pergunta")
          .update("opcao3", novaOpcao3)
          .where("id", perguntaId);
      }
      if (novaOpcao4) {
        await connection("Pergunta")
          .update("opcao4", novaOpcao4)
          .where("id", perguntaId);
      }


      res.json({ message: message ? message : "Ok" });
    } catch (error) {
      console.log(error);
      res.json({ message: "Error" });
    }
  },
  async delete(req, res) {
    const { perguntaId } = req.params;
    const { userId } = req.query;
    try {
      await connection("Pergunta").where({ "categoriaID": categoriaId, "professorID": userId }).del()
      res.json({ message: "Excluido" })

    } catch (error) {
      console.log(error)
      res.json({ message: "error" })
    }

  }
};
