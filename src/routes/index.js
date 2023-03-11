const { Router } = require("express");
const connection = require("../Database/connection.js")



const routes = Router();
routes.get('/user', async (req, res) => {
  const {userId } = req.body;
try {
  const user = await connection("User").select("*").where("cpf", userId).first();
  const {cpf, nome, sobrenome, tipoDeConta, pontuacao, professorId } = user;
  const alunoSearch = await connection("User").select("cpf", "nome", "sobrenome", "tipoDeConta", "pontuacao", "professorId").where("professorId", userId);
  res.json({
      Usuario: {
      cpf, nome, sobrenome, tipoDeConta, pontuacao, professorId},
      alunos: alunoSearch
    })


} catch (error) {
  console.log(error)
  res.json({
    message: "Usuário não encontrado."
  })
  
}

});
routes.get('/categoria', async (req, res) => {
  const {nomeDaCategoria  , professorId} = req.body;

try {
  if(nomeDaCategoria){
    const newCategoriaDB = await connection("Categoria").select("*").where({"categoria": nomeDaCategoria, "professorId": professorId}).first();
  
  res.json({
   categoria: newCategoriaDB
  })


  }else{
    const newCategoriaDB = await connection("Categoria").select("*").where({"professorId": professorId});
  
  res.json({
   categoria: newCategoriaDB
  })


  }
} catch (error) {
  console.log(error)
  res.json({
    message: "Categoria não encontrada"
  })
  
}

});
routes.get('/pergunta', async (req, res)=> {
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

});





routes.post('/login', async  (req, res) => {
    const {cpf, senha}= req.body;
   
    try {
      const user = await connection("User").select("*").where("cpf", cpf).first();
     
  
    Login(cpf, senha);
    connection.destroy;
    function Login(cpf, senha) {
       
   
        if (cpf === user.cpf && senha === user.senha) {
          const {cpf, nome, sobrenome, tipoDeConta, professorId, pontuacao} = user;                      
          res.json({
            message:"Login feito com sucesso!",
            user: {
              cpf, nome, sobrenome, tipoDeConta, professorId, pontuacao
            }
          })
          
        } else {
          console.log('Nome de usuário ou senha incorretos.');
          res.json({
            message:"Nome de usuário ou senha incorretos.",
            user: cpf,
            pass: senha
        })
        }
      }

    } catch (error) {
      res.json({
        message:"Nome de usuário ou senha incorretos.",
            user: cpf,
            pass: senha
      })
    }
      
  });
routes.post('/signup', async (req, res) => {
  const {cpf, nome, sobrenome,tipoDeConta, pontuacao, senha, professorId } = req.body;

  const user = await connection("User").select("*").where("cpf", cpf).first();
  if(user){
    res.json({
      message: "Usuário já cadastrado!"})
  }else{
    if(professorId){
      const newUser = await connection("User").insert({
        cpf, nome, sobrenome,tipoDeConta, pontuacao, senha, professorId
       }).then(() => console.log('Usuário cadastrado com sucesso!'))
       .catch((err) => {
         console.error(err)
         res.json({
           message: "Verifique os dados"
         })})
         
       res.json({
         message: "Usuário criado com sucesso",
         cpf, nome, sobrenome,tipoDeConta, pontuacao, professorId
   
       })
    }else {
      const newUser = await connection("User").insert({
        cpf, nome, sobrenome,tipoDeConta, pontuacao, senha
       }).then(() => console.log('Usuário cadastrado com sucesso!'))
       .catch((err) => {
         console.error(err)
         res.json({
           message: "Verifique o CPF"
         })})
         
       res.json({
         message: "Usuário criado com sucesso",
         cpf, nome, sobrenome,tipoDeConta, pontuacao
   
       })
    }
    
  }
  connection.destroy;
 

});

routes.post('/cadastrarCategoria', async (req, res) => {
  const {categoria, professorId} = req.body;

  try {
    const categoriaDB = await connection("Categoria").select("*").where("categoria", categoria).first();
  if(categoriaDB){
    res.json({
      message: "Categoria já cadastrado!"
    })
  }else{
    const newCategoria = await connection("Categoria").insert({
      categoria,
      professorId
    }).then(() => console.log('Categoria inserida com sucesso!'))
    .catch((err) => console.error(err))
    const categoriaSearch = await connection("Categoria").select("*").where("categoria", categoria).first();
    res.json({
      message: "Categoria criado com sucesso",
      id: categoriaSearch.id,
      categoria,
      professorId

    })
  }
  connection.destroy;
    
  } catch (error) {
    res.json({
      message: "Error"
    })
    
  }
 

});

routes.post('/cadastrarPergunta', async (req, res) => {
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

});

routes.post('/responderPergunta', async (req, res)=> {
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


});



module.exports= routes