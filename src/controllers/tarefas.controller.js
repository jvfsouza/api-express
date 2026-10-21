// controllers/tarefas.controller.js
const tarefaService = require("../services/tarefas.service");

function erroNaoEncontrado() {
  const erro = new Error("Tarefa não encontrada");
  erro.status = 404;
  return erro;
}

async function listar(req, res, next) {
  try {
    const tarefas = await tarefaService.listar(req.queryValido ?? {});
    res.status(200).json(tarefas);
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    const tarefa = await tarefaService.buscarPorId(id);
    if (!tarefa) return next(erroNaoEncontrado());
    res.status(200).json(tarefa);
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

async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const tarefaAtualizada = await tarefaService.atualizar(id, req.body);
    if (!tarefaAtualizada) return next(erroNaoEncontrado());
    res.status(200).json(tarefaAtualizada);
  } catch (err) {
    next(err);
  }
}

async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    const removida = await tarefaService.remover(id);
    if (!removida) return next(erroNaoEncontrado());
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };