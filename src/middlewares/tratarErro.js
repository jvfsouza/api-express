import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const emProducao = process.env.NODE_ENV === 'production';

// log enxuto em dev, log completo em producao
app.use(morgan(emProducao ? 'combined' : 'dev'));

// CORS liberado em dev, restrito em producao
app.use(cors({
  origin: emProducao ? ['https://meusite.com'] : '*'
}));

app.get('/tarefas', (req, res) => {
  res.json({ tarefas: [] });
});

// middleware de erro (4 argumentos): detalhado em dev, generico em producao
app.use((err, req, res, next) => {
  console.error(err); // o log completo sempre fica no servidor

  res.status(err.status || 500).json({
    erro: emProducao ? 'Erro interno do servidor' : err.message,
    ...(emProducao ? {} : { stack: err.stack })
  });
});