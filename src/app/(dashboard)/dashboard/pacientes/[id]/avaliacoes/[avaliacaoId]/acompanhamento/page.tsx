import { Metadata } from 'next'

import AcompanhementoPage from './AcompanhamentoPage'

export const metadata: Metadata = {
  title: 'Acompanhamento | DoctorExe',
  description: '...',
}

export default async function AvaliacaoDetalhesPage({
  params,
}: {
  params: Promise<{ id: string; avaliacaoId: string }>
}) {
  const id = (await params).id
  const avaliacaoId = (await params).avaliacaoId

  return <AcompanhementoPage idPaciente={id} idAvaliacao={avaliacaoId} />
}
