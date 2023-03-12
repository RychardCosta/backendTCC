const connection = require('..//Database/connection');

module.exports = {
    async create(req, res) {
        const {categoria, professorId} = req.body;  
        try {
          const categoriaDB = await connection("Categoria").select("*").where({"categoria": categoria,"professorId": professorId}).first();
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
      },
      async index(req, res) {
        const {nomeDaCategoria  , professorId} = req.query;
      
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
      
      }

}