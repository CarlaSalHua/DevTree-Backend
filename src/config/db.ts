import mongoose from 'mongoose'

export const connectDB = async () => {

    // colocamos un try catch porque puede ser que nos equivoquemos al colocar los usuarios(credenciales), queremos saber cual es el error pero tmb queremos detenre la ejecucion

    try{
        //al final colocamos el nombre de la bd a la cual nos queremos conectar: linktree_node_typescript
        const { connection } = await mongoose.connect(process.env.MONGO_URI)
        //console.log(connection)

        const url2 = `${connection.host}:${connection.port}`
        console.log(`MongoDB conectado en ${url2}`)

    }catch(error){
        console.log(error.message)
        process.exit(1) //terminar  ejecución del programa
    }

}