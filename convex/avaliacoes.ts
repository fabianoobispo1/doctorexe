import { v } from 'convex/values'

import { pacienteSchema } from './schema'
import { mutation, query } from './_generated/server'

export const getAllPaginated = query({
  args: {
    offset: v.number(),
    limit: v.number(),
  },
  handler: async ({ db }, { offset, limit }) => {
    const pacientes = await db.query('paciente').order('desc').collect()

    return pacientes.slice(offset, offset + limit)
  },
})

export const getCount = query({
  handler: async (ctx) => {
    const count = await ctx.db.query('paciente').collect()
    return count.length
  },
})

export const create = mutation({
  args: pacienteSchema,
  handler: async ({ db }, args) => {
    const paciente = await db.insert('paciente', args)
    return paciente
  },
})

export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async ({ db }, { email }) => {
    const paciente = await db
      .query('paciente')
      .withIndex('by_email', (q) => q.eq('email', email))
      .unique()
    return paciente
  },
})
export const getByID = query({
  args: {
    pacienteId: v.id('paciente'),
  },
  handler: async ({ db }, { pacienteId }) => {
    const avaliacao = await db
      .query('avaliacaoFisio')
      .withIndex('by_paciente', (q) => q.eq('pacienteId', pacienteId))
    return avaliacao
  },
})

export const remove = mutation({
  args: {
    pacienteId: v.id('paciente'),
  },
  handler: async ({ db }, { pacienteId }) => {
    const paciente = await db.get(pacienteId)
    if (!paciente) {
      throw new Error('Paciente não encontrado')
    }

    await db.delete(pacienteId)

    return { success: true, message: 'pacienteId removido com sucesso' }
  },
})
