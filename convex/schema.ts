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

export const todoSchema = {
  text: v.string(),
  isCompleted: v.boolean(),
  created_at: v.number(),
  updated_at: v.number(),
  userId: v.id('user'),
}

export const pacienteSchema = {
  nome: v.string(),
  cpf: v.optional(v.string()),
  rg: v.optional(v.string()),
  cnh: v.optional(v.string()),
  dataNascimento: v.number(), // No Convex usamos timestamp
  telefone: v.string(),
  email: v.string(),
  sexo: v.string(),
  cidade: v.string(),
  bairro: v.string(),
  empresa: v.string(),
  plano: v.optional(v.string()),
  enderecoResidencial: v.string(),
  profissao: v.optional(v.string()),
  enderecoComercial: v.string(),
  nomeContatoEmergencia: v.optional(v.string()),
  telefoneContatoEmergencia: v.optional(v.string()),
  escolaridade: v.optional(v.string()),
  naturalidade: v.string(),
  estadoCivil: v.string(),
  created_at: v.number(), // Timestamp para data de criação
  // Relacionamentos serão implementados como IDs
  arquivos: v.optional(v.array(v.id('arquivo'))),
  avaliacoes: v.optional(v.array(v.id('avaliacaoFisio'))),
  exercicios: v.optional(v.array(v.id('patientExercise'))),
}

export const avaliacaoFisioSchema = {
  cod_ficha: v.optional(v.string()),
  dataAvaliacao: v.number(), // DateTime as stimestamp
  altura: v.number(),
  peso: v.number(),
  pressaoArterial: v.string(),
  frequenciaCardiaca: v.number(),
  diagnosticoFisioterapeutico: v.string(),
  apresentacaoPaciente: v.any(), // JSON field
  examesComplementares: v.any(), // JSON field
  inspecaoPalpacao: v.any(), // JSON field
  semiologia: v.string(),
  testesEspecificos: v.string(),
  escalaEva: v.number(),
  objetivosTratamento: v.string(),
  recursosTerapeuticos: v.string(),
  planoTratamento: v.string(),
  created_at: v.number(), // DateTime as timestamp
  updated_at: v.number(), // DateTime as timestamp
  pacienteId: v.id('paciente'),
  evolucoes: v.optional(v.array(v.id('evolucao'))),
}

// Schema para exercícios
export const exerciseSchema = {
  nome: v.string(),
  descricao: v.string(),
  url_img: v.string(),
  url_video: v.string(),
  created_at: v.number(),
  updated_at: v.number(),
}

export const patientExerciseSchema = {
  patient_id: v.id('paciente'),
  exercise_id: v.id('exercise'),
  created_at: v.number(),
  updated_at: v.number(),
}

export const evolucaoSchema = {
  data: v.number(), // DateTime as timestamp
  descricao: v.string(),
  avaliacaoId: v.id('avaliacaoFisio'),
  created_at: v.number(), // DateTime as timestamp
}

export const faleConoscoSchema = {
  email: v.string(),
  nome: v.string(),
  telefone: v.string(),
  mensagem: v.string(),
  isCompleted: v.boolean(),
  created_at: v.number(),
  updated_at: v.number(),
}

export const arquivosSchema = {
  nome: v.string(),
  url: v.string(),
  key: v.string(),
  created_at: v.number(),
  updated_at: v.number(),
  pacienteId: v.id('paciente'),
}

export default defineSchema({
  user: defineTable(userSchema)
    .index('by_email', ['email'])
    .index('by_username', ['nome']),
  recuperaSenha: defineTable(recuperaSenhaSchema).index('by_email', ['email']),
  todo: defineTable(todoSchema).index('by_user', ['userId']),
  paciente: defineTable(pacienteSchema)
    .index('by_nome', ['nome'])
    .index('by_email', ['email']),
  avaliacaoFisio: defineTable(avaliacaoFisioSchema)
    .index('by_paciente', ['pacienteId'])
    .index('by_data', ['dataAvaliacao']),
  exercise: defineTable(exerciseSchema).index('by_nome', ['nome']),
  patientExercise: defineTable(patientExerciseSchema)
    .index('by_patient', ['patient_id'])
    .index('by_exercise', ['exercise_id'])
    .index('by_patient_exercise', ['patient_id', 'exercise_id']),
  faleConosco: defineTable(faleConoscoSchema).index('by_nome', ['nome']),
  evolucao: defineTable(evolucaoSchema)
    .index('by_avaliacao', ['avaliacaoId'])
    .index('by_data', ['data']),
  arquivos: defineTable(arquivosSchema).index('by_paciente', ['pacienteId']),
})
