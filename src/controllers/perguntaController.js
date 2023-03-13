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
            await connection('PerguntasRespondidas').insert({
              perguntaId,
              respostaEscolhida,
              alunoId,
              "professorId": user.professorId,
              "pontosObtidos": 0
  
              }).then(() => console.log('Log de resposta cadastrado com sucesso!'))
           .catch((err) => console.error(err))
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
      
      },
      async gerar(req, res){
        const {professorId} = req.params;
        const {verificarPerguntasRepetidas, alunoId} = req.query;

        

        if(verificarPerguntasRepetidas === "true" && alunoId){
          const perguntasRespondidasSearch = await connection("PerguntasRespondidas").select("*").where({alunoId}).whereNot("pontosObtidos", 0);
         
          const arrayId = []
          
                   
          for(pergunta of perguntasRespondidasSearch){
            arrayId.push(pergunta.perguntaId)
           
          }
          const search = await connection("Pergunta").select("*").whereNotIn("id", arrayId)


          res.json({message: "Perguntas geradas com sucesso", perguntas:search})        
        }else{
          const perguntas = await connection("Pergunta").select("*").where({professorId});
          
          res.json({message: "Perguntas geradas com sucesso", perguntas:shuffleArray(perguntas)})


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

  function itensUnicos(arr) {
    return arr.filter((v, i, a) => a.indexOf(v) === i)
}
      }
}