const connection = require('..//Database/connection');


module.exports = {
    async create(req, res) {
        const {pergunta, resposta,categoriaId, professorId, opcao1, opcao2, opcao3, opcao4} = req.body;
            
        try {
          const perguntaDB = await connection("Pergunta").select("*").where({"pergunta":pergunta, "professorId": professorId}).first();
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
          }).then(() => console.log('Pergunta cadastrado com sucesso!'))
          .catch((err) => console.error(err))
          const perguntaSearch = await connection("Pergunta").select("*").where("pergunta", pergunta).first();
      
          
          res.json({
            message: "Pergunta cadastrada com sucesso!",
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
        const {professorId} = req.params;
        const {id} = req.query;
        console.log(professorId)
        console.log(id)
      
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
        const {perguntaId} = req.params;
        const {respostaEscolhida, alunoId} = req.body;
        try {
        const perguntaSearch = await connection("Pergunta").select("*").where("id",perguntaId ).first();
        const user = await connection("User").select("*").where("cpf", alunoId).first();
       

          if(!user){
          res.json({
            message: "Usuário não encontrado!"})
        }else{
      
          if(respostaEscolhida === perguntaSearch.resposta){
            console.log(respostaEscolhida)
            console.log(perguntaSearch.resposta)
             await connection('PerguntasRespondidas').insert({
              perguntaId,
              respostaEscolhida,
              alunoId,
              "professorId": user.professorId,
              "pontosObtidos": perguntaSearch.valorDaPontuacao
  
              }).then(() => console.log('Log de resposta cadastrado com sucesso!'))
           .catch((err) => console.error(err))
          
            await connection("User").update("pontuacao",  user.pontuacao + perguntaSearch.valorDaPontuacao).where("cpf", user.cpf).then(() => console.log('Pontuação registrada com sucesso!'))
            .catch((err) => console.error(err));
            const respostaSearch = await connection("PerguntasRespondidas").select("*").where({alunoId, perguntaId}).first();



            res.json({
              message: "Resposta certa!",
              resposta:respostaSearch

            
            })
          } else{
            res.json({
              message: "Resposta errada!."

            
            })

          }

        }
         connection.destroy;
      } catch (error) {
        res.json({message: "Error"})
        console.log(error)
      }    
      
      }
}