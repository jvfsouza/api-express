const express = require('express');
const app = express();

app.use(express.json());

let tarefas = [
  { id: 1, titulo: 'Estudar Express', completa: false },
  { id: 2, titulo: 'Fazer compras', completa: true },
];

app.get('/tarefas', (req, res) => {
  res.status(200).json(tarefas);
  console.log('foi executado o get em /tarefas')
});

app.post('/tarefas', (req, res) => {
  const novaTarefa = {
    id: tarefas.length + 1,
    titulo: req.body.titulo,
    completa: false,
  };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
  console.log('foi executado o post em /tarefas')
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});