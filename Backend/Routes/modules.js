const express = require("express");
const Module = require("../models/Modules");
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// Obtener todos los módulos
router.get("/",authenticateToken, async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules); // Retorna todos los módulos
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    res.status(500).json({ message: "Error al obtener módulos", error });
  }
});

// Añadir un nuevo módulo
router.post("/",authenticateToken, async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingModule = await Module.findOne({ name });
    if (existingModule) {
      return res.status(400).json({ message: "El módulo ya existe" });
    }

    const newModule = new Module({ name, description });
    await newModule.save();
    res
      .status(201)
      .json({ message: "Módulo creado exitosamente", module: newModule });
  } catch (error) {
    console.error("Error al crear módulo:", error);
    res.status(500).json({ message: "Error al crear módulo", error });
  }
});

// Eliminar un módulo
router.delete("/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const module = await Module.findByIdAndDelete(id);
    if (!module) {
      return res.status(404).json({ message: "Módulo no encontrado" });
    }
    res.json({ message: "Módulo eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar módulo:", error);
    res.status(500).json({ message: "Error al eliminar módulo", error });
  }
});

// Editar un módulo
router.put("/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const module = await Module.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!module) {
      return res.status(404).json({ message: "Módulo no encontrado" });
    }
    res.json({ message: "Módulo actualizado exitosamente", module });
  } catch (error) {
    console.error("Error al actualizar módulo:", error);
    res.status(500).json({ message: "Error al actualizar módulo", error });
  }
});

module.exports = router;
