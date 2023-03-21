const { Router } = require("express");
const connection = require("../Database/connection.js");

const User = require("../controllers/userController");
const Categoria = require("../controllers/categoriaController");
const Pergunta = require("../controllers/perguntaController");



const routes = Router();
routes.get("/", (req, res) => {
    res.json({message: "Bem-vindo a API.",data:"Esta API é referente ao trabalho de TCC da universidade UNICESUMAR."})
})
routes.get('/user/:userId', User.index)
  

routes.get('/categoria/:professorId', Categoria.index);
routes.get('/pergunta/:professorId', Pergunta.index);
routes.get('/pergunta/gerar/:professorId', Pergunta.gerar);

routes.post('/login', User.login);
routes.post('/signup', User.create);
routes.post('/categoria', Categoria.create);
routes.post('/pergunta', Pergunta.create);
routes.post('/responderPergunta/:perguntaId', Pergunta.responderPergunta);

routes.put('/user/:userId', User.update)





module.exports= routes