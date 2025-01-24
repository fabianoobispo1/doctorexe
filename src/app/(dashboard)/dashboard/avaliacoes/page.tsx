import { Metadata } from 'next'

import { AvaliacoesList } from './avaliacoes-list'

export const metadata: Metadata = {
  title: 'Avaliações Fisioterápicas',
  description: 'Lista de avaliações fisioterápicas',
}

export default function AvaliacoesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Avaliações Fisioterápicas
        </h2>
      </div>
      <AvaliacoesList />
    </div>
  )
}
