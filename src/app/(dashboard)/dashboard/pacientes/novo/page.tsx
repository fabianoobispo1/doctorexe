import { Metadata } from 'next'

import { PacienteForm } from '../components/paciente-form'

export const metadata: Metadata = {
  title: 'Novo Paciente | DoctorExe',
  description: 'Cadastro de novo paciente',
}

export default function NovoPacientePage() {
  return <PacienteForm />
}
