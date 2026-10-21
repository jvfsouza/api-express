// src/schemas/tarefa.schema.js
// Schemas de validacao das tarefas (zod v4).
// Aqui fica o "contrato" da API: o que cada rota aceita no body, na query e nos params.
// A regra de negocio continua no service, a validacao de entrada e daqui.
//
// obs - o arquivo se chama tarefa.schema (singular) porque e a rota que ele cuida:
//       o require nas rotas ja aponta pra ca: require("../schemas/tarefa.schema")

const { z } = require('zod');

/* ------------------------------------------------------------------
   Blocos reutilizaveis
   Cada campo tem a sua regra aqui e se encaixa nos schemas diferentes.
------------------------------------------------------------------ */

// titulo: de 3 a 100 caracteres (sem espaco sobrando nas pontas)
const tituloSchema = z
  .string({ error: 'O titulo e obrigatorio' })
  .trim()
  .min(3, 'O titulo precisa de ao menos 3 caracteres')
  .max(100, 'O titulo pode ter no maximo 100 caracteres');

// descricao: texto livre ate 500 caracteres
const descricaoSchema = z
  .string({ error: 'A descricao precisa ser um texto' })
  .trim()
  .max(500, 'A descricao pode ter no maximo 500 caracteres')
  .optional();

// prioridade: 1 (baixa) ate 3 (alta)
const prioridadeSchema = z
  .int({ error: 'A prioridade precisa ser um numero inteiro' })
  .min(1, 'A prioridade minima e 1')
  .max(3, 'A prioridade maxima e 3')
  .optional();

// concluida: true/false
const concluidaSchema = z
  .boolean({ error: 'O campo concluida precisa ser true ou false' })
  .optional();


/* ------------------------------------------------------------------
   Schemas de entrada (o que o cliente manda)
------------------------------------------------------------------ */

// POST /tarefas - corpo da requisicao para criar uma tarefa.
// o .default() aqui ja deixa a tarefa com os valores padrao,
// e o .strict() barra campo desconhecido (tipo mandar "id" ou "criadaEm" no body).
const tarefaSchema = z
  .object({
    titulo: tituloSchema,
    descricao: descricaoSchema.default(''),
    prioridade: prioridadeSchema.default(1),
    concluida: concluidaSchema.default(false),
  })
  .strict();

// PUT /tarefas/:id - atualizacao.
// aqui nao tem default nenhum (falta de campo = nao mexe nesse campo),
// e precisa vir pelo menos um campo, senao nao ha nada para atualizar.
const atualizarTarefaSchema = z
  .object({
    titulo: tituloSchema.optional(),
    descricao: descricaoSchema,
    prioridade: prioridadeSchema,
    concluida: concluidaSchema,
  })
  .strict()
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Envie pelo menos um campo para atualizar a tarefa',
  });

// GET/PUT/DELETE /tarefas/:id - parametro de rota.
// o z.coerce.number transforma "5" (que chega como texto) em 5.
const tarefaIdSchema = z.object({
  id: z.coerce
    .number({ error: 'O id precisa ser um numero' })
    .int('O id precisa ser um numero inteiro')
    .positive('O id precisa ser maior que zero'),
});

// GET /tarefas - filtros da query string (?concluida=true&titulo=estudar).
// nao usei .strict() aqui porque a query string pode vir com besteira do front.
const tarefaQuerySchema = z.object({
  concluida: z
    .stringbool({ error: 'Use concluida=true ou concluida=false' })
    .optional(),
  titulo: z
    .string()
    .trim()
    .min(1, 'O filtro de titulo nao pode ficar vazio')
    .optional(),
});


/* ------------------------------------------------------------------
   Schema de saida (a forma final da tarefa, ja com id e data de criacao)
------------------------------------------------------------------ */
const tarefaEntitySchema = z.object({
  id: z.number().int().positive(),
  titulo: tituloSchema,
  descricao: descricaoSchema,
  prioridade: prioridadeSchema,
  concluida: concluidaSchema,
  criadaEm: z.iso.datetime({ error: 'A data de criacao precisa estar em ISO 8601' }),
});


module.exports = {
  tarefaSchema, // POST /tarefas
  atualizarTarefaSchema, // PUT /tarefas/:id
  tarefaIdSchema, // params de /tarefas/:id
  tarefaQuerySchema, // query string de GET /tarefas
  tarefaEntitySchema, // forma final da tarefa (saida)
};

// obs - como usar no controller/servico:
//   const { tarefaSchema } = require('../schemas/tarefa.schema');
//   const dados = tarefaSchema.parse(req.body); // lanca erro se estiver errado
//   const ok = tarefaSchema.safeParse(req.body); // devolve { success, data | error }
