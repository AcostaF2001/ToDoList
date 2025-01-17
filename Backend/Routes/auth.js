const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middlewares/auth");
const UsersRole = require("../models/Users_Roles"); // Asegúrate de importar el modelo
require("dotenv").config();

const router = express.Router();

// Clave secreta para firmar tokens (debería estar en el .env)
const JWT_SECRET = process.env.JWT_SECRET;

// Obtener todos los usuarios
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Excluir el campo password
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
});


// Obtener la información de un usuario por ID desde un parámetro de consulta
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const { id } = req.query; // Extraer el id desde los parámetros de consulta

    if (!id) {
      return res.status(400).json({ message: "El parámetro 'id' es obligatorio" });
    }

    const user = await User.findById(id).select("-password"); // Buscar el usuario y excluir el campo password

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
});



// Endpoint para crear un usuario
router.post("/register", async (req, res) => {
  const {
    username,
    password,
    email,
    firstName,
    lastName,
    dateOfBirth,
    profileImage,
    gender,
  } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Validar los datos obligatorios
    if (
      !username ||
      !password ||
      !email ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !profileImage ||
      !gender
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      password,
      email,
      firstName,
      lastName,
      dateOfBirth,
      profileImage,
      gender,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
});

// Endpoint para iniciar sesión
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar al usuario en la base de datos
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Buscar el rol del usuario en la tabla Users_Roles
    const userRole = await UsersRole.findOne({ userId: user._id }).populate({
      path: "roleId", // Poblar el rol
      populate: {
        path: "permissions", // Poblar los permisos del rol
        populate: {
          path: "moduleId", // Poblar el módulo asociado al permiso
          select: "name", // Solo traer el nombre del módulo
        },
      },
    });

    // Si no tiene un rol asignado
    if (!userRole) {
      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
        expiresIn: "10h",
      });

      return res.json({
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          profileImage: user.profileImage,
          gender: user.gender,
        },
        role: null, // Usuario sin rol
      });
    }

    // Extraer el rol y sus permisos
    const role = userRole.roleId;
    const permissions = role.permissions.map((perm) => ({
      id: perm._id,
      permission: perm.permission,
      module: perm.moduleId ? perm.moduleId.name : null,
    }));

    // Generar un token JWT
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: "3h",
    });

    // Responder con el token, datos del usuario, rol y permisos
    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        profileImage: user.profileImage,
        gender: user.gender,
      },
      role: {
        id: role._id,
        name: role.name,
        description: role.description,
        permissions,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
});

// Editar un usuario
router.put("/users/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    gender,
  } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los datos del usuario
    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth); // Convertir la fecha a un objeto Date
    if (gender) {
      // Validar que el género sea uno de los permitidos
      if (["Male", "Female", "Other"].includes(gender)) {
        user.gender = gender;
      } else {
        return res.status(400).json({ message: "Género inválido" });
      }
    }

    // Si hay una contraseña nueva, encriptarla antes de actualizarla
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Guardar los cambios en la base de datos
    await user.save();

    res.json({ message: "Usuario actualizado exitosamente", user });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
});

// Eliminar un usuario por ID
router.delete("/users/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
});

module.exports = router;
