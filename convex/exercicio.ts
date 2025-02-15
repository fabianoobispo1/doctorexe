import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import type { Id } from './_generated/dataModel'

export const getAllPaginated = query({
  args: {
    offset: v.number(),
    limit: v.number(),
  },
  handler: async ({ db }, { offset, limit }) => {
    const exercises = await db.query('exercise').order('desc').collect()

    return exercises.slice(offset, offset + limit)
  },
})

export const getCount = query({
  handler: async (ctx) => {
    const count = await ctx.db.query('exercise').collect()
    return count.length
  },
})

export const create = mutation({
  args: {
    nome: v.string(),
    descricao: v.string(),
    url_img: v.string(),
    url_video: v.string(),
  },
  handler: async ({ db }, { nome, descricao, url_img, url_video }) => {
    const exercicio = await db.insert('exercise', {
      nome,
      descricao,
      url_img,
      url_video,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    return exercicio
  },
})

export const getByNome = query({
  args: {
    nome: v.string(),
  },
  handler: async ({ db }, { nome }) => {
    const exercise = await db
      .query('exercise')
      .withIndex('by_nome', (q) => q.eq('nome', nome))
      .unique()
    return exercise
  },
})

export const getByID = query({
  args: {
    exerciseId: v.id('exercise'),
  },
  handler: async ({ db }, { exerciseId }) => {
    const exercise = await db
      .query('exercise')
      .withIndex('by_id', (q) => q.eq('_id', exerciseId))
      .unique()
    return exercise
  },
})

export const remove = mutation({
  args: {
    exerciseId: v.id('exercise'),
  },
  handler: async ({ db }, { exerciseId }) => {
    const exercise = await db.get(exerciseId)
    if (!exercise) {
      throw new Error('Exercicio não encontrado')
    }

    await db.delete(exerciseId)

    return { success: true, message: 'Exercicio removido com sucesso' }
  },
})

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query('exercise').collect()
  },
})

export const listByPatientId = query({
  args: { patientId: v.id('paciente') },
  handler: async (ctx, args) => {
    // Primeiro busca todos os relacionamentos paciente-exercício
    const patientExercises = await ctx.db
      .query('patientExercise')
      .filter((q) => q.eq(q.field('patient_id'), args.patientId))
      .collect()

    // Busca os detalhes completos de cada exercício
    const exerciseDetails = await Promise.all(
      patientExercises.map(async (pe) => {
        const exercise = await ctx.db.get(pe.exercise_id)
        return exercise
      }),
    )

    return exerciseDetails
  },
})

export const addToPatient = mutation({
  args: {
    patientId: v.string(),
    exerciseId: v.string(),
    created_at: v.number(),
    updated_at: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('patientExercise', {
      patient_id: args.patientId as Id<'paciente'>,
      exercise_id: args.exerciseId as Id<'exercise'>,
      created_at: args.created_at,
      updated_at: args.updated_at,
    })
  },
})

export const removeFromPatient = mutation({
  args: {
    patientId: v.string(),
    exerciseId: v.string(),
  },
  handler: async (ctx, args) => {
    const exerciseToDelete = await ctx.db
      .query('patientExercise')
      .filter((q) =>
        q.and(
          q.eq(q.field('patient_id'), args.patientId),
          q.eq(q.field('exercise_id'), args.exerciseId),
        ),
      )
      .first()

    if (exerciseToDelete) {
      await ctx.db.delete(exerciseToDelete._id)
    }
  },
})

export const getByPatientId = query({
  args: { pascienteId: v.id('paciente') },
  handler: async (ctx, args) => {
    // Busca os relacionamentos paciente-exercício
    const patientExercises = await ctx.db
      .query('patientExercise')
      .filter((q) => q.eq(q.field('patient_id'), args.pascienteId))
      .collect()

    // Busca os detalhes dos exercícios
    const exercises = await Promise.all(
      patientExercises.map(async (pe) => {
        const exercise = await ctx.db.get(pe.exercise_id)
        return {
          ...exercise,
          exercise_id: pe.exercise_id,
        }
      }),
    )

    return exercises
  },
})
