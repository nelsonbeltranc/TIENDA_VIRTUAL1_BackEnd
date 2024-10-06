const jwt = require('jsonwebtoken');
const { generateTokens, verifyRefreshToken } = require('./tokenUtils');
const { verifyToken } = require('./tokenUtils');



const protect = async (req, res, next) => {
  // Este middleware protege las rutas verificando la autorización del usuario

  const accessToken = req.cookies.accessToken;  // Intenta obtener el token de acceso de las cookies de la solicitud
  const refreshToken = req.cookies.refreshToken; // Intenta obtener el token de actualización de las cookies de la solicitud

  if (!accessToken) { // Verifica si el token de acceso está ausente
    if (!refreshToken) { // Verifica si ambos tokens están ausentes
      return res.status(401).json({ message: 'No autorizado, no se encontró token' }); // Envía una respuesta no autorizada si no hay tokens presentes
    }

    // Flujo de actualización de token si el token de acceso falta pero el de actualización existe

    try {
      // Intenta verificar el token de actualización
      const userId = verifyRefreshToken(refreshToken);

      if (userId) { // Si el token de actualización es válido, extrae el ID de usuario
        const { accessToken: newAccessToken } = generateTokens(userId); // Genera un nuevo token de acceso utilizando el ID de usuario

        res.cookie('accessToken', newAccessToken, { // Establece una nueva cookie de token de acceso con opciones seguras
          httpOnly: true, // Evita el acceso desde JavaScript del cliente
          secure: process.env.NODE_ENV === 'production', // Habilita la bandera segura solo en producción
          sameSite: 'strict', // Mitiga ataques de falsificación de solicitudes entre sitios (CSRF)
          maxAge: 15 * 60 * 1000 // Establece el tiempo de expiración del token de acceso en 15 minutos
        });

        req.userId = userId; // Adjunta el ID de usuario extraído al objeto de solicitud
        return next(); // Continúa procesando la solicitud
      } else {
        return res.status(401).json({ message: 'No autorizado, inicie sesión nuevamente' }); // Respuesta no autorizada si el token de actualización no es válido
      }
    } catch (error) { // Maneja posibles errores durante la verificación del token de actualización
      console.error(error); // Registra el error para depuración
      return res.status(401).json({ message: 'No autorizado, inicie sesión nuevamente' }); // Respuesta no autorizada para errores inesperados
    }
  }

  // Flujo de token de acceso si el token de acceso está presente

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET); // Verifica el token de acceso utilizando la clave secreta almacenada en una variable de entorno
    req.userId = decoded.userId; // Extrae el ID de usuario del token de acceso decodificado y lo adjunta al objeto de solicitud
    next(); // Continúa procesando la solicitud si el token de acceso es válido
  } catch (error) {
    if (error.name === 'TokenExpiredError' && refreshToken) { // Maneja el token de acceso expirado con un token de actualización válido
      // Flujo de actualización de token si el token de acceso ha expirado

      try {
        const userId = verifyRefreshToken(refreshToken);

        if (userId) {
          const { accessToken: newAccessToken } = generateTokens(userId);

          res.cookie('accessToken', newAccessToken, { // Establece una nueva cookie de token de acceso con opciones seguras
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
          });

          req.userId = userId;
          return next();
        } else {
          return res.status(401).json({ message: 'No autorizado, inicie sesión nuevamente' });
        }
      } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'No autorizado, inicie sesión nuevamente' });
      }
    } else {
      res.status(401).json({ message: 'No autorizado, token inválido' }); // Respuesta no autorizada para tokens inválidos u otros errores con el token de acceso
    }
  }
};

exports.protect = (req, res, next) => {
  // Implementación básica para pruebas
  console.log('Middleware de protección ejecutado');
  next();
};

exports.admin = (req, res, next) => {
  // Implementación básica para pruebas
  console.log('Middleware de admin ejecutado');
  next();
};

module.exports = { protect }; // Exporta la función de middleware protect para su uso en otras partes de la aplicación