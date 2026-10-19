// routes/tarefas.routes.js
const express = require("express");
const router = express.Router();
const tarefasController = require("../controllers/tarefas.controller");

router.get("/", tarefasController.listar);
router.post("/", tarefasController.criar);

module.exports = router;

// no app.js: app.use("/tarefas", require("./routes/tarefas.routes"));