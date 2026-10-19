// controllers/tarefas.controller.js
const tarefaService = require("../services/tarefas.service");

async function listar(req, res, next) {
  try {
    const tarefas = await tarefaService.listar();
    res.status(200).json(tarefas);
  } catch (err) {
    next(err);
  }
}

async function criar(req, res, next) {
  try {
    const novaTarefa = await tarefaService.criar(req.body);
    res.status(201).json(novaTarefa);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, criar };

// o service completo vem na próxima aula; por enquanto,
// repare que o controller não sabe COMO a tarefa é guardada