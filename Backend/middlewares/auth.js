const jwt = require('jsonwebtoken');

// Middleware para verificar el JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extrae el token de los encabezados

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añadimos el usuario decodificado al objeto `req`
    next(); // Pasamos al siguiente middleware o ruta
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authenticateToken;
