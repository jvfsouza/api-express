// app.js
const express = require('express');
const path = require('path');
const z = require('zod');
const app = express();


const tarefasRouter = require('./routes/tarefas');
const usuariosRouter = require('./routes/usuarios');  // <- arrumar
const vibecodedRouter = require('./routes/vibecoded');
const homepageRouter = require('./routes/homepage');

// schema e sanitiza junto
const criarTarefaSchema = z.object({
  titulo: z.string().trim()
    .min(3, 'O titulo precisa de ao menos 3 caracteres')
    .max(100, 'O titulo pode ter no maximo 100 caracteres'),
  prioridade: z.int().min(1).max(3).optional(),
});
// da pra colocar .strict() se quiser que faça com que qualquer requisição fora do esperado ja seja rejeitada direto


// nome meio auto-explicativo mas tem q ser usada depois de tudo
function tratadorDeErros(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.status ? err.message : 'Erro interno do servidor';

  res.status(status).json({ error: { message } });
}



app.use(express.static(path.join(__dirname, 'public')));

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


// homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});
// valida chave da api
// app.use('/tarefas', verificarApiKey);
// valida token
// app.use(verificarToken);
app.use(logarRequisicao);
app.use(express.json());
app.use('/tarefas', tarefasRouter);
app.use('/usuarios', usuariosRouter); // <- arrumar
app.get('/vibecoded', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'vibecoded.html'));
});
app.get('/arquivos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'arquivos', 'fanta.jpeg'));
});



// começo da separação em rotas(só meio q direciona, direciona pro controller, e consome as rotas e metodos http)
// controller (direciona pro serviço, meio q faz o syscal (service) e devolve a resposta)
//  e service (onde tem a regra de negócio em si)

// é o cliente, product manager e os dev tlgd

// obs - acho q se colocar require dentro do app.use ele só carrega a rota quando precisa, deve melhorar a performance sla
app.use("/tarefas", require("./routes/tarefas.routes"));




app.use(tratadorDeErros)




app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});