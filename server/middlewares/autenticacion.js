const jwt = require("jsonwebtoken");

// ======================================
// Verificar Token
// ======================================
// Request, respond, next (continua con ejecución del programa).

// Todos los middlewares deben tener estos 3 argumentos para ser válidos.
let verificaToken = (req, res, next) => {
  // Recibir el token que está en el header
  let token = req.get("token");

  //DECODED CONTAIN THE PAYLOAD.
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    // if token not valid =>
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no valido",
          err,
        },
      });
    }
    // SENDING THIS PAYLOAD =>
    req.usuario = decoded.usuario;
    next();
  });
};

// ======================================
// Verifica AdminRole
// ======================================

let verificaAdmin_role = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: "El usuario no es administrador",
      },
    });
  }
};

module.exports = {
  verificaToken,
  verificaAdmin_role,
};
