import { Metadata } from 'next'

import PacienteDetalhesPage from './PacienteDetalhesPage'

export const metadata: Metadata = {
  title: 'Detalhes do Paciente | DoctorExe',
  description: 'Visualização detalhada do paciente',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <PacienteDetalhesPage idPaciente={id} />
}
