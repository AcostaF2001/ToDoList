const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true }, // Nombre
  lastName: { type: String, required: true },  // Apellido
  dateOfBirth: { type: Date, required: true }, // Fecha de nacimiento
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }, // Género
  createdAt: { type: Date, default: Date.now } // Fecha de creación
});

// Middleware para encriptar la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema, 'Users');
