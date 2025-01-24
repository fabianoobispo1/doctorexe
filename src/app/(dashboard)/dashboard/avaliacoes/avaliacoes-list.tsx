'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { api } from '@/lib/axios'
import { AvaliacaoFisio } from '@/types/avaliacaoFisio'

import { columns } from './columns'

export function AvaliacoesList() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoFisio[]>([])
  /*   const [loading, setLoading] = useState(true) */
  const router = useRouter()

  useEffect(() => {
    async function loadAvaliacoes() {
      try {
        const response = await api.get('/doctorexe/avaliacaofisio/list')
        setAvaliacoes(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        /*      setLoading(false) */
      }
    }

    loadAvaliacoes()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/dashboard/avaliacoes/nova')}>
          Nova Avaliação
        </Button>
      </div>

      <DataTable<AvaliacaoFisio, unknown>
        columns={columns}
        data={avaliacoes}
        searchKey="nome"
      />
    </div>
  )
}
