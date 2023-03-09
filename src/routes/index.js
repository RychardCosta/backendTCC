const { Router } = require("express");
const connection = require("../Database/connection.js")



const routes = Router();

routes.post('/login',  (req, res) => {
    const {CPF, password}= req.body;
    Login(CPF, password);
      
    function Login(CPF, password) {
       
        // verificar se o usuário existe no banco de dados
        if (CPF === '14102198601' && password === 'senha') {
          console.log('Login bem sucedido!');
          const user = connection("User")
          console.log(user)
         {
            
          }
          res.json({message:"Ok"})
        } else {
          console.log('Nome de usuário ou senha incorretos.');
          res.json({
            message:"Falha no login",
            user: CPF,
            pass: password
        })
        }
      }

      
  });
routes.post('/signup', async (req, res) => {
  const {CPF, name, lastName,accountType, pontuacao, password } = req.body;

  connection("User").select("CPF").where("CPF", "14102198601").then(rows => {
    console.log(rows);
  })

  const user = await connection("User").insert({
    CPF, name, lastName,accountType, pontuacao, password
  }).then(() => console.log('Usuário inserido com sucesso!'))
  .catch((err) => console.error(err))
  
 

  connection.destroy;

  
  res.send("Ok")
}

);


module.exports= routes