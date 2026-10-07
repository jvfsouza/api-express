// app.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const tarefasRouter = require('./routes/tarefas');
const usuariosRouter = require('./routes/usuarios');  // <- arrumar
const imagensRouter = require('./routes/imagens');
// é o log do servidor
function logarRequisicao(req, res, next) {
  const inicio = Date.now();

  // esse res.on finish só roda quando a a requisição acaba
  res.on('finish', () => {
    const duracao = Date.now() - inicio;
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${duracao}ms`);
  });

  next();
}

// verificação de token - tentar melhorar
function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ erro: 'Token nao enviado' });
  }

  next();
}


// chaves de api validas
const CHAVES_VALIDAS = ['abc123', 'def456'];

function verificarApiKey(req, res, next) {
  const chave = req.headers['x-api-key'];

  if (!chave) {
    return res.status(401).json({ erro: 'Cabecalho x-api-key obrigatorio' });
  }

  if (!CHAVES_VALIDAS.includes(chave)) {
    return res.status(403).json({ erro: 'Chave de API invalida' });
  }

  next();
}


// valida chave da api
app.use('/tarefas', verificarApiKey);

// valida token
// pp.use(verificarToken);
app.use(logarRequisicao);
app.use(express.json());
app.use('/tarefas', tarefasRouter);
app.use('/usuarios', usuariosRouter); // <- arrumar
app.use('/tarefas', tarefasRouter);
app.use('/index', imagensRouter);
// tenho que fazer um router para usuarios rs

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});