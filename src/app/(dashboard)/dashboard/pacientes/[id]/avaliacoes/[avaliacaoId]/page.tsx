import { Metadata } from 'next'

import AvaliacoesDetalhePage from './AvaliacoesDetalhePage'

export const metadata: Metadata = {
  title: 'Detalhes da Avaliação | DoctorExe',
  description: 'Visualização detalhada da avaliação física',
}

export default async function AvaliacaoDetalhesPage({
  params,
}: {
  params: Promise<{ id: string; avaliacaoId: string }>
}) {
  const id = (await params).id
  const avaliacaoId = (await params).avaliacaoId
  console.log(id, avaliacaoId)
  return <AvaliacoesDetalhePage idPaciente={id} idAvaliacao={avaliacaoId} />
}
