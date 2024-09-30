// Importar el módulo jsonwebtoken para trabajar con JWT
const jwt = require('jsonwebtoken');
// Importar el modelo de usuario para interactuar con la base de datos
const User = require('../models/User');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  // Comprobar si hay un token en la cabecera de autorización
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer el token de la cabecera
      token = req.headers.authorization.split(' ')[1];
      // Verificar el token y decodificarlo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Buscar el usuario en la base de datos usando el ID decodificado y excluir la contraseña
      req.user = await User.findById(decoded.id).select('-password');
      // Llamar al siguiente middleware
      next();
    } catch (error) {
      // Si hay un error, devolver un mensaje de no autorizado
      res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  // Si no hay token, devolver un mensaje de no autorizado
  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

// Exportar el middleware para que pueda ser utilizado en otras partes de la aplicación
module.exports = { protect };
