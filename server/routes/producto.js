const express = require("express");

const {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

let app = express();
let Producto = require("../models/producto");

// ============================
// Obtener productos.
// ============================
app.get("/productos", verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde); // it's an string as default.

  let limite = req.query.limite || 5;
  limite = Number(limite); // it's an string as default.

  Producto.find(
    { disponible: true },
    "nombre precioUni descripcion disponible categoria usuario"
  )
    .skip(desde)
    .limit(limite)
    .sort("nombre")
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    //execute.
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Producto.countDocuments({ disponible: true }, (err, count) => {
        res.json({
          ok: true,
          productos,
          count,
        });
      });
    });
});

// ============================
// Obtener un producto por ID.
// ============================
app.get("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: "El id del producto no es válido.",
        });
      }
      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

// ============================
// Buscar productos.
// ============================

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;
  // Crear busqueda flexible.
  // Super útil.
  let regex = new RegExp(termino, "i");

  Producto.find({ nombre: regex })
    .populate("usuario", "nombre email")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        productos,
      });
    });
});
// ============================
// Crear un nuevo producto.
// ============================
app.post("/productos", verificaToken, (req, res) => {
  let body = req.body;
  let id = req.usuario._id;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

// ============================
//  Actualizar un producto.
// ============================
app.put("/productos/:id", [verificaToken, verificaAdmin_role], (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoBD,
      });
    }
  );
});

// ============================
// Borrar un producto.
// ============================
app.delete(
  "/productos/:id",
  [verificaToken, verificaAdmin_role],
  (req, res) => {
    let id = req.params.id;
    let setStatusToFalse = {
      disponible: false,
    };

    Producto.findByIdAndUpdate(
      id,
      setStatusToFalse,
      { new: true },
      (err, productoBorrado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!productoBorrado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Producto no encontrado",
            },
          });
        }
        res.json({
          ok: true,
          producto: productoBorrado,
        });
      }
    );
  }
);

module.exports = app;
