const mongoose = require('mongoose');

const UsersRolesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Hace referencia al modelo User
    required: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // Hace referencia al modelo Role
    required: true
  },
  assignedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Users_Role', UsersRolesSchema, 'Users_Roles');
