const { Router } = require("express");
const connection = require("../Database/connection.js");

const User = require("../controllers/userController");
const Categoria = require("../controllers/categoriaController");
const Pergunta = require("../controllers/perguntaController");



const routes = Router();
routes.get('/user/:userId', User.index)
  

routes.get('/categoria/', Categoria.index);
routes.get('/pergunta/:professorId', Pergunta.index);

routes.post('/login', User.login);
routes.post('/signup', User.create);
routes.post('/categoria', Categoria.create);
routes.post('/pergunta', Pergunta.create);
routes.post('/responderPergunta/:perguntaId', Pergunta.responderPergunta);





module.exports= routes