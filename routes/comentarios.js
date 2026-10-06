// routes/comentarios.js
// Sub-recurso: so existe dentro de uma tarefa, ex.: /tarefas/5/comentarios
const express = require('express');

// mergeParams: true faz este router enxergar os parametros
// definidos no prefixo onde ele for montado (tarefaId, nesse caso)
const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
  const { tarefaId } = req.params;
  res.status(200).json({ mensagem: 'Comentarios da tarefa ' + tarefaId });
});

module.exports = router;

// app.js
// app.use('/tarefas/:tarefaId/comentarios', require('./routes/comentarios'));
// sem mergeParams, req.params.tarefaId chegaria undefined dentro do router filho