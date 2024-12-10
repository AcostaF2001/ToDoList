//importar Modulos Necesarios
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const cors = require('cors');


// Configurar dotenv para leer variables del archivo .env
dotenv.config();

// Crear la aplicacion Express
const app = express();

//Configurar el Puerto
const PORT = process.env.PORT || 5000;

// Middleware para manejar JSON y CORS
app.use(express.json());
app.use(cors());

// Obtener la URI de conexion desde el archivo .env
const mongoURI = process.env.MONGO_URI;

// Conectar a MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => {
      console.error('Error al conectar a MongoDB:', error);
      process.exit(1); // Finaliza el proceso si no se puede conectar
  });

//Rutas Base (puedes modularizarlas)
app.get('/', (req,res) => {
    res.send('!Backend Funcionando Correctamente!')
})

// Inicar el servidor
app.listen(PORT,() =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})
