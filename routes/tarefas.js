// routes/tarefas.js
const express = require('express');
const router = express.Router();

let tarefas = [
  { id: 1, titulo: 'Estudar Express', completa: false },
  { id: 2, titulo: 'Fazer compras', completa: true },
];
let proximoId = 3;


// busca todas as tarefa
router.get('/', (req, res) => {
  const { completa } = req.query;

  if (completa === undefined) {
    return res.status(200).json(tarefas);
  }

  const filtradas = tarefas.filter((t) => t.completa === (completa === 'true'));
  res.status(200).json(filtradas);
});

// busca tarefa por id
router.get('/:id', (req, res) => {
  const tarefa = tarefas.find((t) => t.id === Number(req.params.id));
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa nao encontrada' });
  res.status(200).json(tarefa);
});

// coloca tarefa
router.post('/', (req, res) => {
  const novaTarefa = { id: proximoId++, titulo: req.body.titulo, completa: false };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

// muda uma tarefa
router.put('/:id', (req, res) => {
  const tarefa = tarefas.find((t) => t.id === Number(req.params.id));
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa nao encontrada' });

  tarefa.titulo = req.body.titulo;
  tarefa.completa = req.body.completa;
  res.status(200).json(tarefa);
});

// altera uma tarefa
router.patch('/:id', (req, res) => {
  const tarefa = tarefas.find((t) => t.id === Number(req.params.id));
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa nao encontrada' });

  Object.assign(tarefa, req.body);
  res.status(200).json(tarefa);
});

// deleta uma tarefa
router.delete('/:id', (req, res) => {
  const indice = tarefas.findIndex((t) => t.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ erro: 'Tarefa nao encontrada' });

  tarefas.splice(indice, 1);
  res.status(204).end();
});


module.exports = router;