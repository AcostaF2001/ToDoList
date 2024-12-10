const express = require("express");
const Role = require("../models/Roles");
const Permission = require("../models/Permissions");
const authenticateToken = require("../middlewares/auth"); // Middleware de autenticación

const router = express.Router();

// Crear un nuevo rol
router.post("/", authenticateToken, async (req, res) => {
  const { name, description, permissions } = req.body;

  try {
    // Verificar si el rol ya existe
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "El rol ya existe" });
    }

    // Verificar si los permisos existen
    if (permissions) {
      const validPermissions = await Permission.find({
        _id: { $in: permissions },
      });
      if (validPermissions.length !== permissions.length) {
        return res.status(400).json({ message: "Algunos permisos no existen" });
      }
    }

    // Crear el rol
    const newRole = new Role({ name, description, permissions });
    await newRole.save();
    res.status(201).json({ message: "Rol creado exitosamente", role: newRole });
  } catch (error) {
    console.error("Error al crear rol:", error);
    res.status(500).json({ message: "Error al crear rol", error });
  }
});

// Obtener todos los roles
router.get("/", authenticateToken, async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ message: "Error al obtener roles", error });
  }
});

// Obtener un solo rol con sus permisos y el nombre del módulo asociado
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el rol por ID y "populear" el campo "permissions" para obtener los permisos y sus módulos
    const role = await Role.findById(id).populate({
      path: "permissions", // Campo "permissions"
      populate: {
        path: "moduleId", // Dentro de "permissions", poblamos el campo "moduleId" (referencia a "Modules")
        select: "name _id", // Seleccionamos solo el nombre y el ID del módulo
      },
    });

    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.json(role); // Retorna el rol con sus permisos y el nombre del módulo
  } catch (error) {
    console.error("Error al obtener rol:", error);
    res.status(500).json({ message: "Error al obtener rol", error });
  }
});

// Actualizar un rol
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, permissions } = req.body;

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    // Verificar si los permisos existen
    if (permissions) {
      const validPermissions = await Permission.find({
        _id: { $in: permissions },
      });
      if (validPermissions.length !== permissions.length) {
        return res.status(400).json({ message: "Algunos permisos no existen" });
      }
    }

    // Actualizar el rol
    role.name = name || role.name;
    role.description = description || role.description;
    role.permissions = permissions || role.permissions;

    await role.save();
    res.json({ message: "Rol actualizado exitosamente", role });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ message: "Error al actualizar rol", error });
  }
});

// Eliminar un rol
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.json({ message: "Rol eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    res.status(500).json({ message: "Error al eliminar rol", error });
  }
});

module.exports = router;
