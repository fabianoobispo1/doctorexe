import { v } from 'convex/values'

import { mutation, query } from './_generated/server'

export const getAll = query({
  handler: async ({ db }) => {
    return await db.query('faleConosco').order('desc').collect()
  },
})

export const toggle = mutation({
  args: { id: v.id('faleConosco') },
  handler: async ({ db }, { id }) => {
    const faleConosco = await db.get(id)
    if (!faleConosco) throw new Error('Mensagem não encontrada')

    await db.patch(id, {
      isCompleted: !faleConosco.isCompleted,
      updated_at: Date.now(),
    })
  },
})

export const remove = mutation({
  args: { id: v.id('faleConosco') },
  handler: async ({ db }, { id }) => {
    await db.delete(id)
  },
})
export const create = mutation({
  args: {
    email: v.string(),
    nome: v.string(),
    telefone: v.string(),
    mensagem: v.string(),
  },
  handler: async ({ db }, { email, nome, telefone, mensagem }) => {
    const exercicio = await db.insert('faleConosco', {
      email,
      nome,
      telefone,
      mensagem,
      isCompleted: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    return exercicio
  },
})
