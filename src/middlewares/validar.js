// src/middlewares/validar.js
// Middleware que valida a requisicao contra um schema do zod.
//
// Como funciona:
//   - roda o safeParse do schema em req.body (ou req.params / req.query)
//   - se deu certo, segue pra proxima rota com o dado ja limpo
//     (sem campo extra, sem string sobrando, ja convertido)
//   - se deu errado, responde 400 com o detalhe de cada campo
//     e nem chega no controller.
//
// Uso na rota:
//   router.post('/', validar(tarefaSchema), tarefasController.criar);
//   router.get('/:id', validar(tarefaIdSchema, 'params'), tarefasController.buscarPorId);

function validar(schema, origem = 'body') {
  return (req, res, next) => {
    const resultado = schema.safeParse(req[origem]);

    if (!resultado.success) {
      // o issue do zod traz o caminho do campo (path) e a mensagem (message)
      const detalhes = resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.') || origem,
        mensagem: issue.message,
      }));

      return res.status(400).json({
        erro: 'Dados invalidos',
        detalhes,
      });
    }

    // substitui pelo dado validado (sem campo extra e ja convertido)
    // obs - no express 5 o req.query e um getter (ele reparseia a cada acesso),
    //       entao nao da pra trocar o valor dele: guardamos do lado em req.queryValido
    if (origem === 'query') {
      req.queryValido = resultado.data;
    } else {
      req[origem] = resultado.data;
    }

    next();
  };
}

module.exports = { validar };
