exports.registerUser = (req, res) => {
    res.json({ message: 'Registro de usuario' });
  };
  
  exports.loginUser = (req, res) => {
    res.json({ message: 'Login de usuario' });
  };
  
  exports.getUserProfile = (req, res) => {
    res.json({ message: 'Obtener perfil de usuario' });
  };
  
  exports.updateUserProfile = (req, res) => {
    res.json({ message: 'Actualizar perfil de usuario' });
  };
  
  exports.getAllUsers = (req, res) => {
    res.json({ message: 'Obtener todos los usuarios' });
  };
  
  exports.getUserById = (req, res) => {
    res.json({ message: `Obtener usuario con id ${req.params.id}` });
  };
  
  exports.updateUser = (req, res) => {
    res.json({ message: `Actualizar usuario con id ${req.params.id}` });
  };
  
  exports.deleteUser = (req, res) => {
    res.json({ message: `Eliminar usuario con id ${req.params.id}` });
  };