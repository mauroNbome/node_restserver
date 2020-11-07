const express = require("express");

const bcrypt = require("bcrypt");
const _ = require("underscore");

const Usuario = require("../models/usuario");

const app = express();

app.get("/usuario", function (req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde); // it's an string as default.

  let limite = req.query.limite || 5;
  limite = Number(limite); // it's an string as default.

  Usuario.find({ estado: true }, "nombre email estado role google img")
    .skip(desde)
    .limit(limite)
    //execute.
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.countDocuments({ estado: true }, (err, count) => {
        res.json({
          ok: true,
          usuarios,
          count,
        });
      });
    });
});

app.post("/usuario", function (req, res) {
  // Using body-parser
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    // hashSync: automatically hash any data you want,
    // require the data, and salt to be used.
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    // usuarioDB.password = null;

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

// pick = Return a copy of the object, filtered to only have values for the allowed keys.
// Con esto no dejamos que nadie utilice los valores que no estan explicitos.
app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  // { new: true } <-- Esto nos retorna el nuevo objeto, si es false retorna el anterior.

  // { runValidators: true } nos llama todas las validaciones definidas en el Schema (model).
  Usuario.findByIdAndUpdate(
    id,
    body,

    { new: true, runValidators: true },
    (err, usuarioBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBD,
      });
    }
  );
});

// Instead of deleting an user, we're setting the state to false.
app.delete("/usuario/:id", function (req, res) {
  let id = req.params.id;
  let setStatusToFalse = {
    estado: false,
  };

  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  Usuario.findByIdAndUpdate(
    id,
    setStatusToFalse,
    { new: true },
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!usuarioBorrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "usuario no encontrado",
          },
        });
      }
      res.json({
        ok: true,
        usuario: usuarioBorrado,
      });
    }
  );
});

module.exports = app;
