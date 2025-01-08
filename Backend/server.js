//importar Modulos Necesarios
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const cors = require('cors');

//Rutas para los EndPoints
const authRoutes = require('./Routes/auth')
const moduleRoutes = require('./Routes/modules')
const PermissionsRoutes = require('./Routes/permissions')
const roleRoutes = require('./Routes/roles');
const usersRolesRoutes = require('./Routes/users_roles');
const uploadRoutes = require('./Routes/Upload');
const Todo = require('./Routes/todo')


// Configurar dotenv para leer variables del archivo .env
dotenv.config();

// Crear la aplicacion Express
const app = express();

//Configurar el Puerto
const PORT = process.env.PORT;

// Middleware para manejar JSON y CORS
app.use(express.json());
app.use(cors());

// Registrar las rutas con sus prefijos
app.use('/api/auth', authRoutes);  // Rutas relacionadas con autenticación
app.use('/api/modules', moduleRoutes); //Rutas Relacionadas con Modulos
app.use('/api/permissions', PermissionsRoutes); //Rutas Relacionadas con Permisos
app.use('/api/roles', roleRoutes);//Rutas Relacionadas con Roles
app.use('/api/users_roles', usersRolesRoutes);//Rutas Relacionadas con Roles
app.use('/api/upload', uploadRoutes);//Rutas Relacionadas con Subir Imagenes
app.use('/api/todo', Todo);//Rutas Relacionadas con el toDo List


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
