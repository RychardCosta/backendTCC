const { Router } = require("express");
const connection = require("../Database/connection.js")



const routes = Router();

routes.post('/login',  (req, res) => {
    const {username, password}= req.body;
    console.log(password);
    Login(username, password);
      
    function Login(username, password) {
       
        // verificar se o usuário existe no banco de dados
        if (username === 'usuario' && password === 'senha') {
          console.log('Login bem sucedido!');
         {
            
          }
          res.json({message:"Ok"})
        } else {
          console.log('Nome de usuário ou senha incorretos.');
          res.json({
            message:"Falha no login",
            user: username,
            pass: password
        })
        }
      }

      
  });
routes.post('/signup', async (req, res) => {
  const {CPF, name, lastName,accountType, pontuacao } = req.body;
  console.log(CPF)
  const user = await connection("User").insert({
    CPF, name, lastName,accountType, pontuacao
  });

  
  res.send(user.CPF)
}

);


module.exports= routes