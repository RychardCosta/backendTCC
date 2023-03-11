const { Router } = require("express");
const connection = require("../Database/connection.js");

const User = require("../controllers/userController");
const Categoria = require("../controllers/categoriaController");
const Pergunta = require("../controllers/perguntaController");



const routes = Router();
routes.get('/user', User.index)
  

routes.get('/categoria', Categoria.index);
routes.get('/pergunta', Pergunta.index);

routes.post('/login', User.login);
routes.post('/signup', User.create);
routes.post('/cadastrarCategoria', Categoria.create);
routes.post('/cadastrarPergunta', Pergunta.create);
routes.post('/responderPergunta', Pergunta.responderPergunta);



module.exports= routes