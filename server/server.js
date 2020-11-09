require("./config/config");

const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const app = express();

//REMEMBER ^^ That's the order that you should use, otherwise throw an error.

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Configuración global de rutas.
app.use(require("./routes/index"));

mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) throw err;

    console.log("BD ONLINE");
  }
);

app.listen(process.env.PORT, () =>
  console.log("Escuchando el puerto: ", process.env.PORT)
);
