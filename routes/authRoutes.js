// Importar el módulo de Express
const express = require('express');
// Importar las funciones de controlador para el registro e inicio de sesión
const { register, login } = require('../controllers/authController');

// Crear un enrutador de Express
const router = express.Router();

// Definir la ruta para el registro de usuarios
router.post('/register', register);
// Definir la ruta para el inicio de sesión de usuarios
router.post('/login', login);

// Exportar el enrutador para que pueda ser utilizado en otros archivos
module.exports = router;
