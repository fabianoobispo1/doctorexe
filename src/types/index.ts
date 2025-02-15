import { type ClientUploadedFileData } from 'uploadthing/types'

import { Icons } from '@/components/icons'
import type { Id } from '@/convex/_generated/dataModel'

export type UploadedFile<T = unknown> = ClientUploadedFileData<T>

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren

export type PacienteProps = {
  id: Id<'paciente'>
  nome: string
  dataNascimento: number
  telefone: string
  email: string
  sexo: string
  cidade: string
  bairro: string
  empresa: string
  enderecoResidencial: string
  enderecoComercial: string
  naturalidade: string
  estadoCivil: string
  created_at: number
  avaliacoes?: Id<'avaliacaoFisio'>[]
  historicoMedico?: Id<'historicoMedico'>
  exercicios?: Id<'patientExercise'>[]
}

export type ExercicioProps = {
  id: Id<'exercise'>
  nome: string
  descricao: string
  url_img: string
  url_video: string
  created_at: number
}

export type FaleConoscoListProps = {
  _id: Id<'faleConosco'>
  email: string
  nome: string
  telefone: string
  mensagem: string
  isCompleted: boolean
  created_at: number
  updated_at: number
}

export type AvaliacaoFisioProps = {
  _id?: Id<'avaliacaoFisio'>
  dataAvaliacao: number
  altura: number
  peso: number
  pressaoArterial: string
  frequenciaCardiaca: number
  diagnosticoFisioterapeutico: string
  apresentacaoPaciente: Record<string, unknown>
  examesComplementares: Record<string, unknown>
  inspecaoPalpacao: Record<string, unknown>
  semiologia: string
  testesEspecificos: string
  escalaEva: number
  objetivosTratamento: string
  recursosTerapeuticos: string
  planoTratamento: string
  created_at: number
  updated_at: number
  pacienteId: Id<'paciente'>
  evolucoes?: Id<'evolucao'>[]
}
