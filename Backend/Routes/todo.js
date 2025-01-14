const express = require("express");
const ToDo = require("../models/ToDo");
const authenticateToken = require("../middlewares/auth");
const mongoose = require('mongoose');


const router = express.Router();

// Obtener todas las tareas (con filtro por nombre, estado y idUsuario obligatorio)
router.get("/", authenticateToken, async (req, res) => {
  const { idUsuario, name, estado } = req.query; // Filtros opcionales y obligatorio

  if (!idUsuario) {
    return res.status(400).json({ message: "El parámetro idUsuario es obligatorio." });
  }

  try {
    const filter = { idUsuario }; // Filtro base para el idUsuario

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Búsqueda insensible a mayúsculas
    }
    if (estado) {
      filter.estado = estado;
    }

    const todos = await ToDo.find(filter); // Busca tareas que coincidan con los filtros
    res.json(todos); // Retorna las tareas filtradas
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ message: "Error al obtener tareas", error });
  }
});

// Crear una nueva tarea
router.post("/", authenticateToken, async (req, res) => {
  const { idUsuario, name, descripcion, fechaRealizacion, lapsoDeTiempo, objetivos } = req.body;

  try {
    const newToDo = new ToDo({
      idUsuario,
      name,
      estado: "no iniciado", // Siempre comienza con este estado
      descripcion,
      fechaRealizacion,
      lapsoDeTiempo,
      objetivos,
      positionx: null,
      positiony: null // Inicializar posición como null
    });

    await newToDo.save();
    res.status(201).json({ message: "Tarea creada exitosamente", todo: newToDo });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ message: "Error al crear tarea", error });
  }
});

// Actualizar posiciones de tareas
router.put("/order", authenticateToken, async (req, res) => {
  const { idUsuario, tasks } = req.body;

  try {
    if (!idUsuario || !Array.isArray(tasks)) {
      return res.status(400).json({ message: "Datos inválidos." });
    }

    for (const task of tasks) {
      if (!mongoose.Types.ObjectId.isValid(task.id)) {
        return res.status(400).json({ message: `El ID de tarea ${task.id} no es válido.` });
      }
    }

    const updatePromises = tasks.map(task =>
      ToDo.findByIdAndUpdate(task.id, { positionx: task.positionx, positiony: task.positiony })
    );

    await Promise.all(updatePromises);

    res.status(200).json({ message: "Posiciones actualizadas correctamente." });
  } catch (error) {
    console.error("Error al actualizar posiciones:", error);
    res.status(500).json({ message: "Error al actualizar posiciones.", error });
  }
});


// Editar una tarea
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, estado, descripcion, fechaRealizacion, lapsoDeTiempo, objetivos } = req.body;

  try {
    const todo = await ToDo.findByIdAndUpdate(
      id,
      { name, estado, descripcion, fechaRealizacion, lapsoDeTiempo, objetivos },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea actualizada exitosamente", todo });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ message: "Error al actualizar tarea", error });
  }
});

// Borrar una tarea
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await ToDo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ message: "Error al eliminar tarea", error });
  }
});

// Cambiar el estado de una tarea
router.patch("/:id/estado", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const todo = await ToDo.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Estado de la tarea actualizado exitosamente", todo });
  } catch (error) {
    console.error("Error al cambiar estado de la tarea:", error);
    res.status(500).json({ message: "Error al cambiar estado de la tarea", error });
  }
});

// Actualizar objetivos de una tarea
router.patch("/:id/objetivos", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { objetivos } = req.body;

  try {
    const todo = await ToDo.findByIdAndUpdate(
      id,
      { objetivos },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Objetivos de la tarea actualizados exitosamente", todo });
  } catch (error) {
    console.error("Error al actualizar objetivos de la tarea:", error);
    res.status(500).json({ message: "Error al actualizar objetivos de la tarea", error });
  }
});




module.exports = router;
