const connection = require('..//Database/connection');

module.exports = {
    async create(req, res) {
        const {categoria, professorId} = req.body;  
        try {
          const categoriaDB = await connection("Categoria").select("*").where({"categoria": categoria,"professorId": professorId}).first();
        if(categoriaDB){
          res.json({
            message: "Categoria já cadastrada!"
          })
        }else{
          const newCategoria = await connection("Categoria").insert({
            categoria,
            professorId
          }).then(() => console.log('Categoria inserida com sucesso!'))
          .catch((err) => console.error(err))
          const categoriaSearch = await connection("Categoria").select("*").where("categoria", categoria).first();
          res.json({
            message: "Categoria criada com sucesso.",
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
        const { professorId} = req.params;
        const {nomeDaCategoria} = req.query;
        console.log(nomeDaCategoria)
      
      try {
        if(nomeDaCategoria){
          const newCategoriaDB = await connection("Categoria").select("*").where({"categoria": nomeDaCategoria.toUpperCase(), "professorId": professorId}).first();
        
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
      
      },
       async update(req, res){
        const {nomeDaCategoria, novaCategoria} = req.body;

        try {
          const hasCategoria = await connection("Categoria").where("categoria", novaCategoria);
          console.log(hasCategoria)
        if(hasCategoria.length === 0){
          console.log("Aqui")
          await connection("Categoria").update("categoria", novaCategoria).where("categoria", nomeDaCategoria)
          res.json({message: "Ok"})

        }else{
          console.log("nao atualizou")
          res.json({message: "Categoria já cadastrada"})
        }
          
        } catch (error) {
          console.log(error)
          res.json({message: "Error."})
          
        }
        
        
        

        

       },
       async delete(req, res){
        const {nomeDaCategoria} = req.params;
        const {userId} = req.query;
          try {
            const categoria = await connection("Categoria")
            .where("categoria", nomeDaCategoria)
            .first();
            await connection("Categoria").where({"id":categoria.id, "professorId": userId}).del()
            await connection("Pergunta").where({"categoriaID": categoria.id ,"professorID": userId}).del()
            res.json({message: "Excluido"})
            
          } catch (error) {
            console.log(error)
            res.json({message: "error"})
          }
  
        }

}