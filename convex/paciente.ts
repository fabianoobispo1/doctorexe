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

export const UpdatePaciente = mutation({
  args: {
    pacienteId: v.id('paciente'),
    nome: v.optional(v.string()),
    cpf: v.optional(v.string()),
    dataNascimento: v.optional(v.number()),
    telefone: v.optional(v.string()),
    email: v.optional(v.string()),
    sexo: v.optional(v.string()),
    cidade: v.optional(v.string()),
    bairro: v.optional(v.string()),
    empresa: v.optional(v.string()),
    enderecoResidencial: v.optional(v.string()),
    enderecoComercial: v.optional(v.string()),
    naturalidade: v.optional(v.string()),
    estadoCivil: v.optional(v.string()),
  },
  handler: async ({ db }, args) => {
    const paciente = await db.get(args.pacienteId)
    if (!paciente) {
      throw new Error('Paciente não encontrado')
    }

    const updatePaciente = await db.patch(args.pacienteId, {
      nome: args.nome,
      cpf: args.cpf,
      dataNascimento: args.dataNascimento,
      telefone: args.telefone,
      email: args.email,
      sexo: args.sexo,
      cidade: args.cidade,
      bairro: args.bairro,
      empresa: args.empresa,
      enderecoResidencial: args.enderecoResidencial,
      enderecoComercial: args.enderecoComercial,
      naturalidade: args.naturalidade,
      estadoCivil: args.estadoCivil,
    })

    return updatePaciente
  },
})
