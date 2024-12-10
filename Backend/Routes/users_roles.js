const express = require('express');
const UsersRole = require('../models/Users_Roles');
const User = require('../models/User');
const Role = require('../models/Roles');
const authenticateToken = require('../middlewares/auth'); // Middleware de autenticación

const router = express.Router();

// Obtener todos los usuarios con sus roles
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usersRoles = await UsersRole.find()
      .populate('userId', 'username email') // Poblamos el usuario con username y email
      .populate('roleId', 'name description'); // Poblamos el rol con su nombre y descripción

    res.json(usersRoles);
  } catch (error) {
    console.error('Error al obtener usuarios con roles:', error);
    res.status(500).json({ message: 'Error al obtener usuarios con roles', error });
  }
});

// Obtener usuarios con roles y permisos asociados
router.get('/details', authenticateToken, async (req, res) => {
  try {
    const usersRoles = await UsersRole.find()
      .populate('userId', 'username email') // Usuario
      .populate({
        path: 'roleId', // Rol
        populate: {
          path: 'permissions', // Permisos del rol
          populate: {
            path: 'moduleId', // Módulo de cada permiso
            select: 'name'
          }
        }
      });

    res.json(usersRoles);
  } catch (error) {
    console.error('Error al obtener usuarios con roles y permisos:', error);
    res.status(500).json({ message: 'Error al obtener usuarios con roles y permisos', error });
  }
});

// Asignar un rol a un usuario
router.post('/assign', authenticateToken, async (req, res) => {
  const { userId, roleId } = req.body;

  try {
    // Verificar si el usuario ya tiene el rol asignado
    const existingAssignment = await UsersRole.findOne({ userId, roleId });
    if (existingAssignment) {
      return res.status(400).json({ message: 'El usuario ya tiene este rol asignado' });
    }

    // Crear la asignación
    const newAssignment = new UsersRole({ userId, roleId });
    await newAssignment.save();
    res.status(201).json({ message: 'Rol asignado exitosamente al usuario', assignment: newAssignment });
  } catch (error) {
    console.error('Error al asignar rol al usuario:', error);
    res.status(500).json({ message: 'Error al asignar rol al usuario', error });
  }
});

// Eliminar un rol de un usuario
router.delete('/remove/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await UsersRole.findByIdAndDelete(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    res.json({ message: 'Rol eliminado exitosamente del usuario' });
  } catch (error) {
    console.error('Error al eliminar rol del usuario:', error);
    res.status(500).json({ message: 'Error al eliminar rol del usuario', error });
  }
});

// Actualizar un rol asignado a un usuario
router.put('/update/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { roleId } = req.body;

  try {
    const assignment = await UsersRole.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    // Actualizar el rol asignado
    assignment.roleId = roleId;
    await assignment.save();

    res.json({ message: 'Rol actualizado exitosamente para el usuario', assignment });
  } catch (error) {
    console.error('Error al actualizar rol del usuario:', error);
    res.status(500).json({ message: 'Error al actualizar rol del usuario', error });
  }
});

module.exports = router;
