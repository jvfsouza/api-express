// routes/tarefas.js
const express = require('express');
const router = express.Router();

let tarefas = [
  { id: 1, titulo: 'Estudar Express', completa: false },
  { id: 2, titulo: 'Fazer compras', completa: true },
];
let proximoId = 3;

// obs - ele usou schema pq aí da pra reutilizar outros schemas diferentes e ai valida independente com o safeparse. genial.
function validarBody(schema) {
  // o safe parse devolve um true ou false para ver se a requisição é validada, ao inves de retornar o erro
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({
        erro: 'Dados invalidos',
        detalhes: resultado.error.issues.map((p) => ({ campo: p.path.join('.'), mensagem: p.message })),
      });
    }
    req.body = resultado.data; // substitui pelo dado ja validado (e sem campos extras)
    next();
  };
}



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
const { ZodError } = require('zod');

app.post('/tarefas', (req, res) => {
  try {
    const dados = criarTarefaSchema.parse(req.body);
    // a partir daqui, dados esta validado: titulo existe e tem o tamanho certo

    const tarefa = { id: proximoId++, titulo: dados.titulo, prioridade: dados.prioridade ?? 1 };
    tarefas.push(tarefa);
    res.status(201).json(tarefa);
  } catch (erro) {
    if (erro instanceof ZodError) {
      return res.status(400).json({ erro: 'Dados invalidos', detalhes: erro.issues });
    }
    throw erro; // erro inesperado, nao e problema de validacao
  }
});



// outra forma de fazer o post, mas dessa vez com o safe parse
app.post('/tarefas', validarBody(criarTarefaSchema), (req, res) => {
  // aqui dentro, req.body ja esta garantidamente valido
  const tarefa = { id: proximoId++, titulo: req.body.titulo, prioridade: req.body.prioridade ?? 1 };
  tarefas.push(tarefa);
  res.status(201).json(tarefa);
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