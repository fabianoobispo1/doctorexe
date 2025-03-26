import { AcompanhamnetoForm } from '../../nova/acompanhamento-form'

export default function EditarEvolucaoPage({
  params,
}: {
  params: { id: string; avaliacaoId: string; evolucaoId: string }
}) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Editar Consulta</h1>
      <AcompanhamnetoForm
        idPaciente={params.id}
        idAvaliacao={params.avaliacaoId}
        evolucaoId={params.evolucaoId}
        isEditing={true}
      />
    </div>
  )
}
