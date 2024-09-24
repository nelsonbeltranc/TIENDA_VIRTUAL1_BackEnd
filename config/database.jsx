// Importar el módulo mongoose para interactuar con la base de datos MongoDB
const mongoose = require('mongoose');

// Definición de la función asincrónica connectDB
const connectDB = async () => {
  try {
    // Intentar conectarse a MongoDB usando la URI especificada en las variables de entorno
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,  // Usar el nuevo parser de URL de MongoDB
      useUnifiedTopology: true, // Usar el nuevo motor de conexión de MongoDB
    });
    // Si la conexión es exitosa, imprimir un mensaje en la consola con el host de la conexión
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    // Si hay un error durante la conexión, imprimir el mensaje de error en la consola
    console.error(`Error: ${error.message}`);
    // Salir del proceso con un código de error (1)
    process.exit(1);
  }
};

// Exportar la función connectDB para poder utilizarla en otros módulos
module.exports = connectDB;
