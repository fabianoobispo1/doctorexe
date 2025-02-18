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

export const getByEmailInicial = query({
  args: {
    email: v.string(),
  },
  handler: async ({ db }, { email }) => {
    const paciente = await db
      .query('paciente')
      .withIndex('by_email', (q) => q.eq('email', email))
      .unique()

    if (!paciente) return null

    // Busca os exercícios do paciente
    const patientExercises = await db
      .query('patientExercise')
      .withIndex('by_patient', (q) => q.eq('patient_id', paciente._id))
      .collect()

    // Busca os detalhes de cada exercício
    const exercisesDetails = await Promise.all(
      patientExercises.map(async (exercicios) => {
        const exercise = await db.get(exercicios.exercise_id)
        return {
          ...exercicios,
          exerciseDetails: exercise,
        }
      }),
    )

    // Retorna paciente com exercícios
    return {
      ...paciente,
      exercises: exercisesDetails,
    }
  },
})

export const getByID = query({
  args: {
    pacienteId: v.id('paciente'),
  },
  handler: async ({ db }, { pacienteId }) => {
    const paciente = await db
      .query('paciente')
      .withIndex('by_id', (q) => q.eq('_id', pacienteId))
      .unique()
    return paciente
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
