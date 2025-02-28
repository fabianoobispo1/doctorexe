import { v } from 'convex/values'

import { query, mutation } from './_generated/server'
import { evolucaoSchema } from './schema'

export const create = mutation({
  args: evolucaoSchema,
  handler: async ({ db }, args) => {
    const evolucao = await db.insert('evolucao', args)
    return evolucao
  },
})
export const getEvolucaoByAvaliacao = query({
  args: {
    avaliacaoId: v.id('avaliacaoFisio'),
  },
  handler: async ({ db }, { avaliacaoId }) => {
    const evolucoes = await db
      .query('evolucao')
      .withIndex('by_avaliacao', (q) => q.eq('avaliacaoId', avaliacaoId)) // Passa o userId corretamente
      .collect() // Retorna todos os todos associados ao userId

    return evolucoes
  },
})
