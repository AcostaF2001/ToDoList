const mongoose = require('mongoose');


//Esquema de Modules en la DB
const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

//Exportar al Esquema ya creado
module.exports = mongoose.model('Module', ModuleSchema, 'Modules');
