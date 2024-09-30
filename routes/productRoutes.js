const express = require('express');
const router = express.Router();
// Aquí importarías el controlador de usuarios una vez que lo hayas creado
// const { 
//   getUserProfile, 
//   updateUserProfile, 
//   getAllUsers, 
//   deleteUser 
// } = require('../controllers/userController');

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de usuarios funcionando' });
});

// Obtener perfil del usuario
router.get('/profile', (req, res) => {
  res.json({ message: 'Obtener perfil del usuario' });
});

// Actualizar perfil del usuario
router.put('/profile', (req, res) => {
  res.json({ message: 'Actualizar perfil del usuario' });
});

// Obtener todos los usuarios (admin)
router.get('/', (req, res) => {
  res.json({ message: 'Obtener todos los usuarios' });
});

// Eliminar un usuario (admin)
router.delete('/:id', (req, res) => {
  res.json({ message: `Eliminar usuario con id ${req.params.id}` });
});

module.exports = router;