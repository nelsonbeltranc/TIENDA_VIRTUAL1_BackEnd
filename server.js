// Importar el módulo express para crear el servidor web
const express = require('express');

// Importar mongoose para interactuar con la base de datos MongoDB
const mongoose = require('mongoose');

// Importar cors para permitir solicitudes de diferentes orígenes (Cross-Origin Resource Sharing)
const cors = require('cors');

// Importar dotenv para manejar variables de entorno desde un archivo .env
const dotenv = require('dotenv');

// Importar las rutas de autenticación y otras rutas de la aplicación
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de la aplicación Express
const app = express();

// Middleware
// Permitir CORS para que el servidor acepte solicitudes de diferentes orígenes
app.use(cors());
// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Suprimir advertencias de deprecación
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning') return;
  console.warn(warning.name, warning.message);
});

// Conectar a MongoDB usando la URI especificada en las variables de entorno
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Definir las rutas de la API
// Todas las solicitudes a /api/v1/auth se manejarán con las rutas de autenticación
app.use('/api/v1/auth', authRoutes);
// Rutas para categorías
app.use('/api/v1/categories', categoryRoutes);
// Rutas para productos
app.use('/api/v1/products', productRoutes);
// Rutas para órdenes
app.use('/api/v1/orders', orderRoutes);
// Rutas para usuarios
app.use('/api/v1/users', userRoutes);

// Manejo de errores para la aplicación
app.use((err, req, res, next) => {
  console.error(err.stack); // Imprimir la traza del error en la consola
  res.status(500).send('Algo salió mal!'); // Enviar respuesta al cliente con un mensaje de error
});

// Definir el puerto en el que el servidor escuchará
const PORT = process.env.PORT || 5000;
// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
