// src/routes/tarefas.routes.js
const express = require("express");
const router = express.Router();

const tarefasController = require("../controllers/tarefas.controller");
const { validar } = require("../middlewares/validar");
const {
  tarefaSchema,
  atualizarTarefaSchema,
  tarefaIdSchema,
  tarefaQuerySchema,
} = require("../schemas/tarefa.schema");

// GET /tarefas?concluida=true&titulo=estudar
router.get("/", validar(tarefaQuerySchema, "query"), tarefasController.listar);
// GET /tarefas/:id
router.get("/:id", validar(tarefaIdSchema, "params"), tarefasController.buscarPorId);
// POST /tarefas
router.post("/", validar(tarefaSchema), tarefasController.criar);
// PUT /tarefas/:id
router.put("/:id", validar(tarefaIdSchema, "params"), validar(atualizarTarefaSchema), tarefasController.atualizar);
// DELETE /tarefas/:id
router.delete("/:id", validar(tarefaIdSchema, "params"), tarefasController.remover);

module.exports = router;
// no app.js: app.use("/tarefas", require("./src/routes/tarefas.routes"));
