import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { AvaliacaoForm } from '../../../../components/avaliacao-form'

export default async function EditarEvolucaoPage({
  params,
}: {
  params: Promise<{ id: string; avaliacaoId: string }>
}) {
  const id = (await params).id
  const avaliacaoId = (await params).avaliacaoId

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/pacientes/${id}/avaliacoes`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Editar Avaliações</h1>
      </div>
      <div className="rounded-md border p-4">
        <AvaliacaoForm
          pacienteId={id}
          avaliacaoId={avaliacaoId}
          isEditing={true}
        />
      </div>
    </div>
  )
}
