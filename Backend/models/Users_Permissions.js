const mongoose = require('mongoose');

const UsersPermissionsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Hace referencia al modelo User
    required: true
  },
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission', // Hace referencia al modelo Permission
    required: true
  },
  assignedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Users_Permission', UsersPermissionsSchema, 'Users_Permissions');
