import { Metadata } from 'next'

import { PacienteForm } from '../../components/paciente-form'

export const metadata: Metadata = {
  title: 'Avaliações do Paciente | DoctorExe',
  description: 'Visualização de avaliações do paciente',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <PacienteForm pacienteId={id} />
}
