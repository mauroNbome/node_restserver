const express = require("express");

let {
  verificaToken,
  verificaAdmin_role,
} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");

// ===========================
// Crear una categoria
// ===========================
app.post("/categoria", [verificaToken, verificaAdmin_role], (req, res) => {
  let body = req.body;
  let id = req.usuario._id;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// ===========================
// Mostrar categoria
// ===========================
app.get("/categoria", [verificaToken, verificaAdmin_role], (req, res) => {
  Categoria.find({})

    .sort("descripcion") // Ordenar por descripción.
    .populate("usuario", "nombre email") // Llamar campos relacionados, segundo argumento son los campos deseados.
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categorias,
      });
    });
});

// ===========================
// Modificar categoría
// ===========================
app.put("/categoria/:id", [verificaToken, verificaAdmin_role], (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Categoria.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

// ===========================
// Borrado de categoría
// ===========================
app.delete(
  "/categoria/:id",
  [verificaToken, verificaAdmin_role],
  (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: "El id no existe.",
        });
      }
      res.json({
        ok: true,
        message: "Categoría borrada",
      });
    });
  }
);

// ===========================
// GET única categoría
// ===========================
app.get("/categoria/:id", (req, res) => {
  let id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: "El id no es válido.",
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

module.exports = app;
