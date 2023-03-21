const e = require("express");
const connection = require("../Database/connection.js")

module.exports = {

    async login (req, res) {
        const {cpf, senha}= req.body;
        

        try {
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

          
          
        } catch (error) {
          console.log(error);
          res.json({message: "error"})          
        }  
      },
      async index(req, res) {
        const {userId } = req.params;
            
        try {
            const user = await connection("User").select("*").where("cpf", userId).first();
            const {cpf, nome, sobrenome, tipoDeConta, pontuacao, professorId } = user;
            const alunoSearch = await connection("User").select("cpf", "nome", "sobrenome", "tipoDeConta", "pontuacao", "professorId").where("professorId", userId);
            const categoriaSearch = await connection("Categoria").select("*").where("professorId", userId);
            const perguntaSearch = await connection("Pergunta").select("*").where("professorId", userId);
            
            if(tipoDeConta === "professor"){
              
              res.json({
                Usuario: {
                  cpf, nome, sobrenome, tipoDeConta, pontuacao, professorId},
                  alunos: alunoSearch,
                  categorias: categoriaSearch,
                  perguntas: perguntaSearch
                })
                
                
              }else{
              const perguntaRespondidaSearch = await connection("PerguntasRespondidas").select("*").where("alunoId", userId);
              res.json({
                Usuario: {
                cpf, nome, sobrenome, tipoDeConta, pontuacao, professorId},
                perguntaRespondidaSearch
              
                
              })
            }

          
              
          }catch(error){
            console.log(error)
            res.json({
            message: "Usuário não encontrado."

          })


        
      }},
      async create(req, res)  {
        const {cpf, nome, sobrenome,tipoDeConta, senha, professorId } = req.body;

        try {
            
        const user = await connection("User").select("*").where("cpf", cpf).first();
        if(user){
          res.json({
            message: "Usuário já cadastrado!"})
        }else{
          if(professorId){
            const newUser = await connection("User").insert({
              cpf, nome, sobrenome,tipoDeConta, senha, professorId
             }).then(() => console.log('Usuário cadastrado com sucesso!'))
             .catch((err) => {
               console.error(err)
               res.json({
                 message: "Verifique os dados"
               })})
               
             res.json({
               message: "Usuário criado com sucesso",
               user: {
                 cpf, nome, sobrenome,tipoDeConta, professorId
                }
         
             })
          }else {
            const newUser = await connection("User").insert({
              cpf, nome, sobrenome,tipoDeConta, senha
             }).then(() => console.log('Usuário cadastrado com sucesso!'))
             .catch((err) => {
               console.error(err)
               res.json({
                 message: "Verifique o CPF"
               })})

               await connection("Categoria").insert({
                categoria: "GERAL",
                professorId: cpf
              }).then(() => console.log('Categoria inserida com sucesso!'))
              .catch((err) => console.error(err))
               
             res.json({
               message: "Usuário criado com sucesso",
               user:{
                 cpf, nome, sobrenome,tipoDeConta
               }

         
             })
          }
          
        }
        connection.destroy;

          
        } catch (error) {
          console.log(error);
          res.json({message: "error"});
          
        }
      },
      async update(req, res) {
        const {userId} = req.params;
        const {nome, sobrenome, senha} = req.body;


        try {
          const user = await  connection("User").select("*").where("cpf", userId)
          console.log(user)
          if(user.length > 0){
            if(nome){
              try {
                await connection("User").update("nome", nome).where("cpf", userId)              
              } catch (error) {
                console.log(error)
                res.json({message: 'Error.'})
              }
            }
            if(sobrenome){
              try {
                await connection("User").update("sobrenome", sobrenome).where("cpf", userId)              
              } catch (error) {
                console.log(error)
                res.json({message: 'Error.'})
              }
            }
            if(senha){
              try {
                await connection("User").update("senha", senha).where("cpf", userId)              
              } catch (error) {
                console.log(error)
                res.json({message: 'Error.'})
              }
            }
    
            res.send("Ok")

          }else{
            res.json({message: 'Usuário não encontrado.'})
          }

         
        } catch (error) {
          console.log(error)
          res.json({message: 'Error.'})
          
        }


      }

}

  