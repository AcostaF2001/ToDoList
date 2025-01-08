const express = require("express");
const ToDo = require("../models/ToDo");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

// Obtener todas las tareas (con filtro por nombre y estado)
router.get("/", authenticateToken, async (req, res) => {
  const { name, estado } = req.query; // Filtros opcionales

  try {
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Búsqueda insensible a mayúsculas
    }
    if (estado) {
      filter.estado = estado;
    }

    const todos = await ToDo.find(filter);
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
    });

    await newToDo.save();
    res.status(201).json({ message: "Tarea creada exitosamente", todo: newToDo });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ message: "Error al crear tarea", error });
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
