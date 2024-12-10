const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission' // Hace referencia al modelo Permission
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', RoleSchema, 'Roles');
