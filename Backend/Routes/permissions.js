const express = require("express");
const Permission = require("../models/Permissions");
const UsersPermission = require("../models/Users_Permissions");
const Module = require("../models/Modules");
const User = require("../models/User");
const authenticateToken = require("../middlewares/auth"); // Middleware para verificar el token

const router = express.Router();

// Obtener todos los permisos
router.get("/", authenticateToken, async (req, res) => {
  try {
    const permissions = await Permission.find().populate(
      "moduleId",
      "name _id"
    );
    res.json(permissions);
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    res.status(500).json({ message: "Error al obtener permisos", error });
  }
});

// Crear un permiso para un módulo
router.post("/", authenticateToken, async (req, res) => {
  const { moduleId, permission } = req.body;

  try {
    // Verificar si el módulo existe
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Módulo no encontrado" });
    }

    // Crear el permiso
    const newPermission = new Permission({ moduleId, permission });
    await newPermission.save();
    res.status(201).json({
      message: "Permiso creado exitosamente",
      permission: newPermission,
    });
  } catch (error) {
    console.error("Error al crear permiso:", error);
    res.status(500).json({ message: "Error al crear permiso", error });
  }
});

// Editar un permiso
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { permission } = req.body;

  try {
    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      { permission },
      { new: true, runValidators: true }
    );
    if (!updatedPermission) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }
    res.json({
      message: "Permiso actualizado exitosamente",
      permission: updatedPermission,
    });
  } catch (error) {
    console.error("Error al actualizar permiso:", error);
    res.status(500).json({ message: "Error al actualizar permiso", error });
  }
});

// Eliminar un permiso
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPermission = await Permission.findByIdAndDelete(id);
    if (!deletedPermission) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }
    res.json({ message: "Permiso eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar permiso:", error);
    res.status(500).json({ message: "Error al eliminar permiso", error });
  }
});

// Asignar un permiso a un rol
router.post("/assign-to-role", authenticateToken, async (req, res) => {
  const { roleId, permissionId } = req.body;

  try {
    // Verificar si el rol existe
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    // Verificar si el permiso existe
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }

    // Verificar si el permiso ya está asignado al rol
    if (role.permissions.includes(permissionId)) {
      return res
        .status(400)
        .json({ message: "El permiso ya está asignado a este rol" });
    }

    // Asignar el permiso al rol
    role.permissions.push(permissionId);
    await role.save();

    res
      .status(201)
      .json({ message: "Permiso asignado al rol exitosamente", role });
  } catch (error) {
    console.error("Error al asignar permiso al rol:", error);
    res.status(500).json({ message: "Error al asignar permiso al rol", error });
  }
});

router.delete("/remove-from-role", authenticateToken, async (req, res) => {
  const { roleId, permissionId } = req.body;

  try {
    // Verificar si el rol existe
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    // Verificar si el permiso está asignado al rol
    if (!role.permissions.includes(permissionId)) {
      return res
        .status(400)
        .json({ message: "El permiso no está asignado a este rol" });
    }

    // Remover el permiso del array
    role.permissions = role.permissions.filter(
      (id) => id.toString() !== permissionId
    );
    await role.save();

    res.json({ message: "Permiso eliminado del rol exitosamente", role });
  } catch (error) {
    console.error("Error al eliminar permiso del rol:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar permiso del rol", error });
  }
});

module.exports = router;
