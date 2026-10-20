// routes/tarefas.routes.js
const express = require("express");
const router = express.Router();

const tarefasController = require("../controllers/tarefas.controller");
const { validar } = require("../middlewares/validar");
const { tarefaSchema, atualizarTarefaSchema } = require("../schemas/tarefa.schema");

router.get("/", tarefasController.listar);
router.get("/:id", tarefasController.buscarPorId);
router.post("/", validar(tarefaSchema), tarefasController.criar);
router.put("/:id", validar(atualizarTarefaSchema), tarefasController.atualizar);
router.delete("/:id", tarefasController.remover);

module.exports = router;
// no app.js: app.use("/tarefas", require("./routes/tarefas.routes"));