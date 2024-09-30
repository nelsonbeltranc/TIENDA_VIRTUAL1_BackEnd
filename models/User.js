// Importar mongoose para interactuar con MongoDB
const mongoose = require('mongoose');

// Importar bcryptjs para el manejo de contraseñas
const bcrypt = require('bcryptjs');

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String, // Tipo de dato para el nombre de usuario
    required: [true, 'Por favor ingrese un nombre de usuario'], // Validación para que sea requerido
    unique: true, // El nombre de usuario debe ser único en la base de datos
  },
  email: {
    type: String, // Tipo de dato para el email
    required: [true, 'Por favor ingrese un email'], // Validación para que sea requerido
    unique: true, // El email debe ser único en la base de datos
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido'], // Validación con expresión regular para el formato del email
  },
  password: {
    type: String, // Tipo de dato para la contraseña
    required: [true, 'Por favor ingrese una contraseña'], // Validación para que sea requerido
    minlength: 6, // La contraseña debe tener al menos 6 caracteres
  },
  role: {
    type: String, // Tipo de dato para el rol del usuario
    enum: ['customer', 'admin'], // Rol permitido: 'customer' o 'admin'
    default: 'customer', // Rol por defecto es 'customer'
  },
}, {
  timestamps: true, // Agregar campos de createdAt y updatedAt automáticamente
});

// Middleware pre-save para hashear la contraseña antes de guardarla
userSchema.pre('save', async function(next) {
  // Si la contraseña no ha sido modificada, pasar al siguiente middleware
  if (!this.isModified('password')) {
    return next();
  }
  // Generar un 'salt' para el hashing
  const salt = await bcrypt.genSalt(10);
  // Hashear la contraseña antes de guardarla
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Pasar al siguiente middleware
});

// Método para comparar la contraseña ingresada con la almacenada
userSchema.methods.matchPassword = async function(enteredPassword) {
  // Comparar la contraseña ingresada con la hasheada en la base de datos
  return await bcrypt.compare(enteredPassword, this.password);
};

// Crear el modelo de usuario usando el esquema definido
const User = mongoose.model('User', userSchema);

// Exportar el modelo para que pueda ser utilizado en otros módulos
module.exports = User;
