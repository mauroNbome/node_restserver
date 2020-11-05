const express = require("express");
const app = express();
require("./config/config");

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/usuario", function (req, res) {
  res.json("get_usuario");
});

app.post("/usuario", function (req, res) {
  // Using body-parser
  let body = req.body;

  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      message: "name is required",
    });
  } else {
    res.json({
      user: body,
    });
  }
});

app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;

  res.json(`put_usuario ${id}`);
});

app.delete("/usuario", function (req, res) {
  res.json("delete_usuario");
});

app.listen(process.env.PORT, () =>
  console.log("Escuchando el puerto: ", process.env.PORT)
);
