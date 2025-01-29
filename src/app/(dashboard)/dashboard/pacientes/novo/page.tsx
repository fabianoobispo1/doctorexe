import { Metadata } from 'next'

import { PacienteForm } from '../components/paciente-form'

export const metadata: Metadata = {
  title: 'Novo Paciente | DoctorExe',
  description: 'Cadastro de novo paciente',
}

export default function NovoPacientePage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Novo Paciente</h1>
      </div>
      <div className="rounded-md border p-4">
        <PacienteForm />
      </div>
    </div>
  )
}
