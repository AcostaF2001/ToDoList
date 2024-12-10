const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module', // Hace referencia al modelo Module
    required: true
  },
  permission: {
    type: String,
    enum: ['read', 'write', 'admin'], // Tipos de permisos posibles
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Permission', PermissionSchema, 'Permissions');
