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

export const remove = mutation({
  args: {
    evolucaoId: v.id('evolucao'),
  },
  handler: async ({ db }, { evolucaoId }) => {
    const evolucao = await db.get(evolucaoId)
    if (!evolucao) {
      throw new Error('Evolução não encontrada')
    }

    await db.delete(evolucaoId)

    return { success: true, message: 'Evolução removida com sucesso' }
  },
})
// Adicione esta função ao seu arquivo evolucao.ts existente
export const update = mutation({
  args: {
    evolucaoId: v.id('evolucao'),
    data: v.number(),
    descricao: v.string(),
  },
  handler: async ({ db }, { evolucaoId, data, descricao }) => {
    const evolucao = await db.get(evolucaoId)
    if (!evolucao) {
      throw new Error('Evolução não encontrada')
    }

    await db.patch(evolucaoId, {
      data,
      descricao,
    })

    return { success: true, message: 'Evolução atualizada com sucesso' }
  },
})

// Adicione também uma função para buscar uma evolução específica
export const getById = query({
  args: {
    evolucaoId: v.id('evolucao'),
  },
  handler: async ({ db }, { evolucaoId }) => {
    return await db.get(evolucaoId)
  },
})
