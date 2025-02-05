import { v } from 'convex/values'
import { defineSchema, defineTable } from 'convex/server'

// Schema para usuários
export const userSchema = {
  nome: v.string(),
  email: v.string(),
  provider: v.string(),
  role: v.union(v.literal('admin'), v.literal('user')),
  image: v.optional(v.string()),
  image_key: v.optional(v.string()),
  password: v.string(),
  data_nascimento: v.optional(v.number()),
  cpf: v.optional(v.string()),
  last_login: v.optional(v.number()),
}

export const recuperaSenhaSchema = {
  email: v.string(),
  created_at: v.number(),
  valid_at: v.number(),
}

// Schema para todos
export const todoSchema = {
  text: v.string(),
  isCompleted: v.boolean(),
  created_at: v.number(),
  updated_at: v.number(),
  userId: v.id('user'),
}

export const avaliacaoFisioSchema = {
  dataAvaliacao: v.string(),
  // Identificação
  nome: v.string(),
  dataNascimento: v.string(),
  telefone: v.string(),
  sexo: v.string(),
  cidade: v.string(),
  bairro: v.string(),
  empresa: v.string(),
  enderecoResidencial: v.string(),
  enderecoComercial: v.string(),
  naturalidade: v.string(),
  estadoCivil: v.string(),
  diagnosticoClinico: v.string(),
  diagnosticoFisioterapeutico: v.string(),

  // Avaliação
  historiaClinica: v.string(),
  queixaPrincipal: v.string(),
  habitosVida: v.string(),
  hma: v.string(),
  hmp: v.string(),
  antecedentePessoal: v.string(),
  antecedenteFamiliar: v.string(),
  tratamentosRealizados: v.string(),
  altura: v.number(),
  peso: v.number(),
  pressaoArterial: v.string(),
  frequenciaCardiaca: v.number(),

  // Exame Clínico
  apresentacaoPaciente: v.object({
    deambulando: v.boolean(),
    deambulandoComApoio: v.boolean(),
    cadeiraRodas: v.boolean(),
    internado: v.boolean(),
    orientado: v.boolean(),
  }),

  examesComplementares: v.object({
    possui: v.boolean(),
    descricao: v.string(),
    imagens: v.array(v.string()),
  }),

  medicamentos: v.object({
    usa: v.boolean(),
    descricao: v.string(),
  }),

  cirurgias: v.object({
    realizou: v.boolean(),
    descricao: v.string(),
  }),

  inspecaoPalpacao: v.object({
    normal: v.boolean(),
    edema: v.boolean(),
    cicatrizacaoIncompleta: v.boolean(),
    eritemas: v.boolean(),
    outros: v.string(),
  }),

  semiologia: v.string(),
  testesEspecificos: v.string(),
  escalaEva: v.number(),

  // Plano Terapêutico
  objetivosTratamento: v.string(),
  recursosTerapeuticos: v.string(),
  planoTratamento: v.string(),
  createdAt: v.string(),
  updatedAt: v.string(),
}
export const evolucoesFisioSchema = {
  avaliacaoId: v.id('avaliacaoFisio'),
  data: v.string(),
  descricao: v.string(),
  createdAt: v.string(),
}

// Definição do Schema completo
export default defineSchema({
  user: defineTable(userSchema)
    .index('by_email', ['email'])
    .index('by_username', ['nome']),
  recuperaSenha: defineTable(recuperaSenhaSchema).index('by_email', ['email']),
  todo: defineTable(todoSchema).index('by_user', ['userId']), // Índice para buscar todos de um usuário
  avaliacaoFisio: defineTable(avaliacaoFisioSchema).index('by_nome', ['nome']),
  evolucoesFisio: defineTable(evolucoesFisioSchema).index('by_avaliacaoId', [
    'avaliacaoId',
  ]),
})
