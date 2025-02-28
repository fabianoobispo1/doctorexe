import { v } from 'convex/values'

import { query, mutation } from './_generated/server'
import { arquivosSchema } from './schema'

export const create = mutation({
  args: arquivosSchema,
  handler: async ({ db }, args) => {
    const arquivos = await db.insert('arquivos', args)
    return arquivos
  },
})
export const getarquivosByPaciente = query({
  args: {
    pacienteId: v.id('paciente'),
  },
  handler: async ({ db }, { pacienteId }) => {
    const arquivos = await db
      .query('arquivos')
      .withIndex('by_paciente', (q) => q.eq('pacienteId', pacienteId))
      .collect()

    return arquivos
  },
})

export const listarArquivos = query({
  handler: async ({ db }) => {
    const arquivos = await db.query('arquivos').collect()
    return arquivos
  },
})

export const deletarArquivo = mutation({
  args: {
    id: v.id('arquivos'),
  },
  handler: async ({ db }, { id }) => {
    const arquivo = await db.get(id)

    if (!arquivo) {
      throw new Error('Arquivo não encontrado')
    }

    await db.delete(id)
    return { success: true, arquivoId: id, key: arquivo.key }
  },
})
