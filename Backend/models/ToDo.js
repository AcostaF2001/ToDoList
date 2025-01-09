const mongoose = require('mongoose');

// Esquema de ToDo en la DB
const ToDoSchema = new mongoose.Schema({
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
  estado: { 
    type: String, 
    enum: ['completado', 'avanzado', 'no iniciado'], 
    required: true 
  },
  name: { type: String, required: true }, // Nombre de la tarea
  descripcion: { type: String, required: true }, // Breve descripción de la tarea
  fechaCreacion: { type: Date, default: Date.now }, // Fecha en que se creó
  fechaRealizacion: { type: Date }, // Fecha límite para realizar la tarea (opcional)
  lapsoDeTiempo: { 
    inicio: { type: Date }, // Inicio del lapso (opcional)
    fin: { type: Date } // Fin del lapso (opcional)
  },
  objetivos: [
    {
      descripcion: { type: String, required: true }, // Descripción del objetivo
      completado: { type: Boolean, default: false } // Estado del objetivo (completado o no)
    }
  ]
});

// Exportar el esquema ya creado
module.exports = mongoose.model('ToDo', ToDoSchema, 'ToDo');
