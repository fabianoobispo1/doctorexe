import { Metadata } from 'next'

import AvaliacoesPage from './AvaliacoesPage'

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

  return <AvaliacoesPage idPaciente={id} />
}
