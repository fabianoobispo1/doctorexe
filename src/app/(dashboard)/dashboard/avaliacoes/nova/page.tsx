'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { AvaliacaoForm } from './avaliacao-form'

export default function NovaAvaliacaoPage() {
  const router = useRouter()
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Nova Avaliação</h2>
        <div className="flex justify-end">
          <Button onClick={() => router.push('/dashboard/avaliacoes')}>
            Voltar
          </Button>
        </div>
      </div>
      <AvaliacaoForm />
    </div>
  )
}
