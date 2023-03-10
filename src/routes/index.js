const { Router } = require("express");
const connection = require("../Database/connection.js")



const routes = Router();
routes.get('/user', async (req, res) => {
  const {userId} = req.body;
try {
  const user = await connection("User").select("*").where("cpf", userId).first();
  const {cpf, nome, sobrenome, tipoDeConta, pontuacao, professorID } = user;
  res.json({
    cpf, nome, sobrenome, tipoDeConta, pontuacao, professorID
  })

} catch (error) {
  console.log(error)
  res.json({
    message: "Error"
  })
  
}

});
routes.get('/categoria', async (req, res) => {
  const {nomeDaCategoria  , professorId} = req.body;

try {
  const newCategoriaDB = await connection("Categoria").select("*").where({"categoria": nomeDaCategoria, "professorID": professorId}).first();
  
  res.json({
   categoria: newCategoriaDB
  })

} catch (error) {
  console.log(error)
  res.json({
    message: "Error"
  })
  
}

});

routes.post('/login', async  (req, res) => {
    const {cpf, senha}= req.body;
    console.log(cpf)
    const user = await connection("User").select("*").where("cpf", cpf).first();
      console.log("DB", user.cpf)
    console.log(user)
  
    Login(cpf, senha);
    connection.destroy;
    function Login(cpf, senha) {
       
        // verificar se o usuário existe no banco de dados
        if (cpf === user.cpf && senha === user.senha) {
          console.log('Login bem sucedido!');
                       
          res.json({message:"Ok"})
        } else {
          console.log('Nome de usuário ou senha incorretos.');
          res.json({
            message:"Falha no login",
            user: cpf,
            pass: senha
        })
        }
      }

      
  });
routes.post('/signup', async (req, res) => {
  const {cpf, nome, sobrenome,tipoDeConta, pontuacao, senha } = req.body;

  const user = await connection("User").select("*").where("cpf", cpf).first();
  if(user){
    res.send("Usuário já cadastrado!")
  }else{
    const newUser = await connection("User").insert({
     cpf, nome, sobrenome,tipoDeConta, pontuacao, senha
    }).then(() => console.log('Usuário inserido com sucesso!'))
    .catch((err) => {
      console.error(err)
      res.json({
        message: "Verifique o CPF"
      })})

    res.json({
      message: "Usuário inserido com sucesso"
    })
  }
  connection.destroy;
 

});

routes.post('/cadastrarCategoria', async (req, res) => {
  const {categoria, professorId} = req.body;

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
      message: "Categoria inserida com sucesso",
      id: categoriaSearch.id,
      categoria,
      professorId

    })
  }
  connection.destroy;
 

});



module.exports= routes