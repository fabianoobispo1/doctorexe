import { Metadata } from 'next'

import { AvaliacaoForm } from '../../../components/avaliacao-form'

export const metadata: Metadata = {
  title: 'Nova Avaliação | DoctorExe',
  description: 'Cadastro de nova avaliação física',
}

export default async function NovaAvaliacaoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Nova Avaliação Física
      </h1>
      <div className="rounded-md border p-4">
        <AvaliacaoForm pacienteId={id} />
      </div>
    </div>
  )
}
