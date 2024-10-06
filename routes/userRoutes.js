const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Comentamos temporalmente estas importaciones
// const { protect, admin } = require('../middleware/authMiddleware');
// const { 
//   registerUser,
//   loginUser,
//   getUserProfile, 
//   updateUserProfile, 
//   getAllUsers, 
//   getUserById,
//   updateUser,
//   deleteUser 
// } = require('../controllers/userController');

// Rutas públicas
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario o email ya está registrado' });
    }

    // Crear nuevo usuario
    const user = new User({
      username,
      email,
      password
    });

    // Guardar usuario
    const savedUser = await user.save();

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});


router.post('/login', (req, res) => {
  res.json({ message: 'Login de usuario' });
});

// Rutas protegidas (requieren autenticación)
router.get('/profile', (req, res) => {
  res.json({ message: 'Obtener perfil del usuario' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Actualizar perfil del usuario' });
});

// Rutas de administrador
router.get('/', (req, res) => {
  res.json({ message: 'Obtener todos los usuarios' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Obtener usuario con id ${req.params.id}` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Actualizar usuario con id ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Eliminar usuario con id ${req.params.id}` });
});

module.exports = router;