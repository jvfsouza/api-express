

const criarTarefaSchema = z.object({
  titulo: z.string().trim()
    .min(3, 'O titulo precisa de ao menos 3 caracteres')
    .max(100, 'O titulo pode ter no maximo 100 caracteres'),
  prioridade: z.int().min(1).max(3).optional(),
});
// d