// Importar el modelo de usuario
const User = require('../models/User');
// Importar el módulo jwt para la creación de tokens
const jwt = require('jsonwebtoken');

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    // Desestructurar los datos del cuerpo de la solicitud
    const { username, email, password } = req.body;
    
    // Verificar si el usuario ya existe en la base de datos
    const userExists = await User.findOne({ email });
    
    // Si el usuario ya existe, devolver un error
    if (userExists) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }
    
    // Crear un nuevo usuario en la base de datos
    const user = await User.create({ username, email, password });
    
    // Generar un token JWT con el ID del usuario
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Enviar una respuesta con los detalles del usuario y el token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    // Manejo de errores: si ocurre un error, devolver un mensaje de error
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Función para iniciar sesión
exports.login = async (req, res) => {
  try {
    // Desestructurar los datos del cuerpo de la solicitud
    const { email, password } = req.body;
    
    // Buscar al usuario en la base de datos por el email
    const user = await User.findOne({ email });
    
    // Verificar si el usuario existe y si la contraseña ingresada es correcta
    if (user && (await user.matchPassword(password))) {
      // Generar un token JWT con el ID del usuario
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      // Enviar una respuesta con los detalles del usuario y el token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      // Si las credenciales son inválidas, devolver un error
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    // Manejo de errores: si ocurre un error, devolver un mensaje de error
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
