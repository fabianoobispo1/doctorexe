'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { AvaliacaoFisio } from '@/types/avaliacaoFisio'
import { Button } from '@/components/ui/button'

const ActionCell = ({ avaliacao }: { avaliacao: AvaliacaoFisio }) => {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      onClick={() => router.push(`/dashboard/avaliacoes/${avaliacao.id}`)}
    >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  )
}

export const columns: ColumnDef<AvaliacaoFisio>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'dataAvaliacao',
    header: 'Data',
    cell: ({ row }) => {
      return new Date(row.getValue('dataAvaliacao')).toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell avaliacao={row.original} />,
  },
]
