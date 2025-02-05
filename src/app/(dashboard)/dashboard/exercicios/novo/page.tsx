import { Metadata } from 'next'

import { ExercicioForm } from '../components/exercicio-form'

export const metadata: Metadata = {
  title: 'Novo Exercicio | DoctorExe',
  description: 'Cadastro de novo paciente',
}

export default function NovoExercicioPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Novo Exercicio</h1>
      </div>
      <div className="rounded-md border p-4">
        <ExercicioForm />
      </div>
    </div>
  )
}
