import { v } from 'convex/values'

import { avaliacaoFisioSchema } from './schema'
import { mutation, query } from './_generated/server'

export const create = mutation({
  args: avaliacaoFisioSchema,
  handler: async ({ db }, args) => {
    const avaliacaoFisio = await db.insert('avaliacaoFisio', args)
    return avaliacaoFisio
  },
})

export const getByID = query({
  args: {
    pacienteId: v.id('paciente'),
  },
  handler: async ({ db }, { pacienteId }) => {
    const avaliacoes = await db
      .query('avaliacaoFisio')
      .withIndex('by_paciente', (q) => q.eq('pacienteId', pacienteId))
      .collect()
    return avaliacoes
  },
})

export const getAvaliacaoById = query({
  args: {
    avaliacaoId: v.id('avaliacaoFisio'),
  },
  handler: async ({ db }, { avaliacaoId }) => {
    const avaliacao = await db.get(avaliacaoId)
    return avaliacao
  },
})

export const remove = mutation({
  args: {
    avaliacaoId: v.id('avaliacaoFisio'),
  },
  handler: async ({ db }, { avaliacaoId }) => {
    const avaliacao = await db.get(avaliacaoId)
    if (!avaliacao) {
      throw new Error('Avaliação não encontrada')
    }

    await db.delete(avaliacaoId)

    return { success: true, message: 'Avaliação removida com sucesso' }
  },
})

export const update = mutation({
  args: {
    avaliacaoId: v.id('avaliacaoFisio'),
    dataAvaliacao: v.number(),
    altura: v.number(),
    peso: v.number(),
    pressaoArterial: v.string(),
    frequenciaCardiaca: v.number(),
    diagnosticoFisioterapeutico: v.string(),
    apresentacaoPaciente: v.string(),
    examesComplementares: v.string(),
    inspecaoPalpacao: v.string(),
    semiologia: v.string(),
    testesEspecificos: v.string(),
    escalaEva: v.number(),
    objetivosTratamento: v.string(),
    recursosTerapeuticos: v.string(),
    planoTratamento: v.string(),
    updated_at: v.number(),
  },
  handler: async (
    { db },
    {
      avaliacaoId,
      dataAvaliacao,
      altura,
      peso,
      pressaoArterial,
      frequenciaCardiaca,
      diagnosticoFisioterapeutico,
      apresentacaoPaciente,
      examesComplementares,
      inspecaoPalpacao,
      semiologia,
      testesEspecificos,
      escalaEva,
      objetivosTratamento,
      recursosTerapeuticos,
      planoTratamento,
    },
  ) => {
    const avaliacao = await db.get(avaliacaoId)
    if (!avaliacao) {
      throw new Error('Evolução não encontrada')
    }

    await db.patch(avaliacaoId, {
      dataAvaliacao,
      altura,
      peso,
      pressaoArterial,
      frequenciaCardiaca,
      diagnosticoFisioterapeutico,
      apresentacaoPaciente,
      examesComplementares,
      inspecaoPalpacao,
      semiologia,
      testesEspecificos,
      escalaEva,
      objetivosTratamento,
      recursosTerapeuticos,
      planoTratamento,
    })

    return { success: true, message: 'Avaliação atualizada com sucesso' }
  },
})
