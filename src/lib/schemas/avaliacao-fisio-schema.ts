import * as z from 'zod'

export const avaliacaoFisioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  dataAvaliacao: z.date(),
  dataNascimento: z.date(),
  telefone: z.string(),
  sexo: z.string(),
  cidade: z.string(),
  bairro: z.string(),
  profissao: z.string(),
  enderecoResidencial: z.string(),
  enderecoComercial: z.string(),
  naturalidade: z.string(),
  estadoCivil: z.string(),
  diagnosticoClinico: z.string(),
  diagnosticoFisioterapeutico: z.string(),

  historiaClinica: z.string(),
  queixaPrincipal: z.string(),
  habitosVida: z.string(),
  hma: z.string(),
  hmp: z.string(),
  antecedentePessoal: z.string(),
  antecedenteFamiliar: z.string(),
  tratamentosRealizados: z.string(),
  altura: z.number(),
  peso: z.number(),
  pressaoArterial: z.string(),
  frequenciaCardiaca: z.number(),

  apresentacaoPaciente: z.object({
    deambulando: z.boolean(),
    deambulandoComApoio: z.boolean(),
    cadeiraRodas: z.boolean(),
    internado: z.boolean(),
    orientado: z.boolean(),
  }),

  examesComplementares: z.object({
    possui: z.boolean(),
    descricao: z.string(),
    imagens: z.array(z.string()),
  }),

  medicamentos: z.object({
    usa: z.boolean(),
    descricao: z.string(),
  }),

  cirurgias: z.object({
    realizou: z.boolean(),
    descricao: z.string(),
  }),

  inspecaoPalpacao: z.object({
    normal: z.boolean(),
    edema: z.boolean(),
    cicatrizacaoIncompleta: z.boolean(),
    eritemas: z.boolean(),
    outros: z.string(),
  }),

  semiologia: z.string(),
  testesEspecificos: z.string(),
  escalaEva: z.number(),

  objetivosTratamento: z.string(),
  recursosTerapeuticos: z.string(),
  planoTratamento: z.string(),
  evolucoes: z.array(
    z.object({
      data: z.date(),
      descricao: z.string(),
    }),
  ),
})
