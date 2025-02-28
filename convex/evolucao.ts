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

export const toggleTodoCompletion = mutation({
  args: {
    todoId: v.id('todo'), // ID do todo a ser atualizado
  },
  handler: async ({ db }, { todoId }) => {
    // Buscar o todo atual
    const todo = await db.get(todoId)
    if (!todo) {
      throw new Error('Todo não encontrado')
    }

    // Alternar o valor de isCompleted
    const updatedTodo = await db.patch(todoId, {
      isCompleted: !todo.isCompleted, // Inverte o valor de isCompleted
      updated_at: Date.now(), // Atualiza o timestamp do updated_at
    })

    return updatedTodo // Retorna o todo atualizado
  },
})

export const remove = mutation({
  args: {
    todoId: v.id('todo'), // ID do todo a ser removido
  },
  handler: async ({ db }, { todoId }) => {
    // Buscar o todo para garantir que ele existe antes de remover
    const todo = await db.get(todoId)
    if (!todo) {
      throw new Error('Todo não encontrado')
    }

    // Remover o todo do banco de dados
    await db.delete(todoId)

    return { success: true, message: 'Todo removido com sucesso' } // Resposta de confirmação
  },
})
