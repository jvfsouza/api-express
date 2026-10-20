import express from 'express';
import morgan from 'morgan';

const app = express();

// Formato	Uso recomendado	O que inclui
// dev	| Desenvolvimento | local	Método, rota, status colorido por faixa e tempo de resposta
// combined	| Produção	| IP de origem, data, método, rota, status, tamanho da resposta e user-agent
// common |	Produção | (mais enxuto que combined)	Parecido com o combined, sem o user-agent
// tiny	| Ambientes | com pouco espaço em log	Só o essencial: método, rota, status e tamanho

app.use(morgan('dev'));

// GET /tarefas 200 3.412 ms - 128
// POST /tarefas 201 8.190 ms - 64
// GET /tarefas/999 404 1.203 ms - 27