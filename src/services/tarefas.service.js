// services/tarefas.service.js
let tarefas = [];
let proximoId = 1;

function listar() {
  return tarefas;
}

function buscarPorId(id) {
  return tarefas.find((tarefa) => tarefa.id === id) || null;
}

function criar(dados) {
  const novaTarefa = {
    id: proximoId++,
    titulo: dados.titulo,
    descricao: dados.descricao || "",
    concluida: false,
    criadaEm: new Date().toISOString(),
  };
  tarefas.push(novaTarefa);
  return novaTarefa;
}

function atualizar(id, dados) {
  const tarefa = buscarPorId(id);
  if (!tarefa) return null;
  Object.assign(tarefa, dados);
  return tarefa;
}

function remover(id) {
  const indice = tarefas.findIndex((tarefa) => tarefa.id === id);
  if (indice === -1) return false;
  tarefas.splice(indice, 1);
  return true;
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };