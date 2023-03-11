const connection = require('..//Database/connection');


module.exports = {
    async create(req, res) {
        const {pergunta, resposta,categoriaId, professorId, opcao1, opcao2, opcao3, opcao4} = req.body;
            
        try {
          const perguntaDB = await connection("Pergunta").select("*").where("pergunta", pergunta).first();
          if(perguntaDB){
            res.json({
              message: "Pergunta ja cadastrada"
            })
          
        }else{
          const newPergunta = connection('Pergunta').insert({
             pergunta,
             resposta ,
             categoriaId,
             professorId,
             opcao1, 
             opcao2, 
             opcao3, 
             opcao4
          }).then(() => console.log('Categoria cadastrado com sucesso!'))
          .catch((err) => console.error(err))
          const perguntaSearch = await connection("Pergunta").select("*").where("pergunta", pergunta).first();
      
          
          res.json({
            pergunta: perguntaSearch,
          
          })
          connection.destroy;
      
        }
      
        } catch (error) {
          console.log(error)
          res.json({
            message: "Error"
          })
          
        }
      
      },
      async index(req, res) {
        const {id} = req.body;
      
        try {
          if(id){
            const perguntaSearch = await connection("Pergunta").select("*").where({"id": id, "professorId": professorId});
            res.json({
                pergunta: perguntaSearch
              });
      
          }else{
            const perguntaSearch = await connection("Pergunta").select("*").where("professorId", professorId);
            res.json({
                pergunta: perguntaSearch
              });
      
          }
      
       
        } catch (error) {
          res.json({
              message: "Nenhuma pergunta encontrada"
            });
        }
      
      },
      async responderPergunta(req, res) {
        const {perguntaId, respostaEscolhida, alunoId, professorId} = req.body;
      try {
        const newLogPergunta = connection('PerguntasRespondidas').insert({
          perguntaId,
          respostaEscolhida ,
          alunoId,
          professorId,
          }).then(() => console.log('Log de resposta cadastrado com sucesso!'))
       .catch((err) => console.error(err))
       const respostaSearch = await connection("PerguntasRespondidas").select("*").where(alunoId, perguntaId).first();
      
        res.json({
      
        pergunta: respostaSearch
      
      })
      
       connection.destroy;
      } catch (error) {
        res.json({message: "Error"})
        console.log(error)
      }
      
      
      }
}