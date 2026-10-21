// services/tarefas.service.js
let tarefas = [];
let proximoId = 1;

// lista as tarefas, aplicando os filtros que chegam da query (?concluida=true)
function listar(filtros = {}) {
  const { concluida, titulo } = filtros;

  return tarefas.filter((tarefa) => {
    if (concluida !== undefined && tarefa.concluida !== concluida) return false;
    if (titulo && !tarefa.titulo.toLowerCase().includes(titulo.toLowerCase())) return false;
    return true;
  });
}

function buscarPorId(id) {
  return tarefas.find((tarefa) => tarefa.id === id) || null;
}

function criar(dados) {
  const novaTarefa = {
    id: proximoId++,
    titulo: dados.titulo,
    descricao: dados.descricao || "",
    prioridade: dados.prioridade ?? 1,
    concluida: dados.concluida ?? false,
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