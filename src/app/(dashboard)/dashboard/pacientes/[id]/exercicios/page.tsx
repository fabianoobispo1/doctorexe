import { Metadata } from 'next'

import ExerciciosPage from './ExerciciosPage'

export const metadata: Metadata = {
  title: 'Exercícios do Paciente | DoctorExe',
  description: 'Visualização de exercícios do paciente',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <ExerciciosPage idPaciente={id} />
}
