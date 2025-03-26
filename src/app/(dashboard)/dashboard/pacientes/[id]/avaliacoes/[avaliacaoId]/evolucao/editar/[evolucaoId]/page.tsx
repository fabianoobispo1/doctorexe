import { AcompanhamnetoForm } from '../../nova/acompanhamento-form'

export default async function EditarEvolucaoPage({
  params,
}: {
  params: Promise<{ id: string; avaliacaoId: string; evolucaoId: string }>
}) {
  const id = (await params).id
  const avaliacaoId = (await params).avaliacaoId
  const evolucaoId = (await params).evolucaoId
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Editar Consulta</h1>
      <AcompanhamnetoForm
        idPaciente={id}
        idAvaliacao={avaliacaoId}
        evolucaoId={evolucaoId}
        isEditing={true}
      />
    </div>
  )
}
