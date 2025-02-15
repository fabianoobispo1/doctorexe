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
  dataNascimento: v.number(), // No Convex usamos timestamp
  telefone: v.string(),
  email: v.string(),
  sexo: v.string(),
  cidade: v.string(),
  bairro: v.string(),
  empresa: v.string(),
  enderecoResidencial: v.string(),
  enderecoComercial: v.string(),
  naturalidade: v.string(),
  estadoCivil: v.string(),
  created_at: v.number(), // Timestamp para data de criação
  // Relacionamentos serão implementados como IDs
  avaliacoes: v.optional(v.array(v.id('avaliacaoFisio'))),
  historicoMedico: v.optional(v.id('historicoMedico')),
  exercicios: v.optional(v.array(v.id('patientExercise'))),
}

export const historicoMedicoSchema = {
  diagnosticoClinico: v.string(),
  historiaClinica: v.string(),
  queixaPrincipal: v.string(),
  habitosVida: v.string(),
  hma: v.string(),
  hmp: v.string(),
  antecedentePessoal: v.string(),
  antecedenteFamiliar: v.string(),
  tratamentosRealizados: v.string(),
  medicamentos: v.any(), // Para campos JSON
  cirurgias: v.any(), // Para campos JSON
  pacienteId: v.id('paciente'), // Referência ao paciente
  created_at: v.number(), // Timestamp de criação
}

export const avaliacaoFisioSchema = {
  dataAvaliacao: v.number(), // DateTime as timestamp
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
  historicoMedico: defineTable(historicoMedicoSchema).index('by_paciente', [
    'pacienteId',
  ]),
  exercise: defineTable(exerciseSchema).index('by_nome', ['nome']),
  patientExercise: defineTable(patientExerciseSchema)
    .index('by_patient', ['patient_id'])
    .index('by_exercise', ['exercise_id'])
    .index('by_patient_exercise', ['patient_id', 'exercise_id']),
  faleConosco: defineTable(faleConoscoSchema).index('by_nome', ['nome']),
  evolucao: defineTable(evolucaoSchema)
    .index('by_avaliacao', ['avaliacaoId'])
    .index('by_data', ['data']),
})
