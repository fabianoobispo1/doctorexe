import { Metadata } from 'next'

import { AcompanhamnetoForm } from './acompanhamento-form'

export const metadata: Metadata = {
  title: 'Novo Regsitro | DoctorExe',
  description: 'Cadastro de novo registro',
}

export default async function NovaAvaliacaoPage({
  params,
}: {
  params: Promise<{ id: string; avaliacaoId: string }>
}) {
  const id = (await params).id
  const avaliacaoId = (await params).avaliacaoId
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Novo Registro</h1>
      <div className="rounded-md border p-4">
        <AcompanhamnetoForm idPaciente={id} idAvaliacao={avaliacaoId} />
      </div>
    </div>
  )
}
