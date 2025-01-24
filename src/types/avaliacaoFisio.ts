export interface AvaliacaoFisio {
  id: string
  dataAvaliacao: Date

  // 1.0 Identificação
  nome: string
  dataNascimento: Date
  telefone: string
  sexo: string
  cidade: string
  bairro: string
  profissao: string
  enderecoResidencial: string
  enderecoComercial: string
  naturalidade: string
  estadoCivil: string
  diagnosticoClinico: string
  diagnosticoFisioterapeutico: string

  // 2.0 Avaliação
  historiaClinica: string
  queixaPrincipal: string
  habitosVida: string
  hma: string
  hmp: string
  antecedentePessoal: string
  antecedenteFamiliar: string
  tratamentosRealizados: string
  altura: number
  peso: number
  pressaoArterial: string
  frequenciaCardiaca: number

  // 3.0 Exame Clínico
  apresentacaoPaciente: {
    deambulando: boolean
    deambulandoComApoio: boolean
    cadeiraRodas: boolean
    internado: boolean
    orientado: boolean
  }

  examesComplementares: {
    possui: boolean
    descricao: string
    imagens: string[] // URLs das imagens
  }

  medicamentos: {
    usa: boolean
    descricao: string
  }

  cirurgias: {
    realizou: boolean
    descricao: string
  }

  inspecaoPalpacao: {
    normal: boolean
    edema: boolean
    cicatrizacaoIncompleta: boolean
    eritemas: boolean
    outros: string
  }

  semiologia: string
  testesEspecificos: string
  escalaEva: number

  // 4.0 Plano Terapêutico
  objetivosTratamento: string
  recursosTerapeuticos: string
  planoTratamento: string
  evolucoes: Array<{
    data: Date
    descricao: string
  }>
}
