// app.js
const express = require('express');
const app = express();

const tarefasRouter = require('./routes/tarefas');
// const usuariosRouter = require('./routes/usuarios');  // <- arrumar

// é o log do servidor
function logarRequisicao(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
}

app.use(logarRequisicao);
app.use(express.json());
app.use('/tarefas', tarefasRouter);
// app.use('/usuarios', usuariosRouter); // <- arrumar

// tenho que fazer um router para usuarios rs

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

// A partir daqui, router.get('/:id') dentro de tarefas.js responde de verdade em GET /tarefas/:id