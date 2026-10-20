import app from './app.js';

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});

// tarefas.test.js: o teste importa o app, nunca o server.js
// test() e expect() vem do seu test runner (Jest ou Vitest)
import request from 'supertest';
import app from './app.js';

test('GET /tarefas responde 200 com uma lista', async () => {
  const resposta = await request(app).get('/tarefas');

  expect(resposta.status).toBe(200);
  expect(Array.isArray(resposta.body.tarefas)).toBe(true);
});