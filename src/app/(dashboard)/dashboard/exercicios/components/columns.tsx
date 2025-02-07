'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { extractYouTubeID } from '@/lib/utils'

import { ActionCell } from './actionColun'

export type Paciente = {
  id: string
  nome: string
  descricao: string
  url_img: string
  url_video: string
  created_at: string
}

export const columns: ColumnDef<Paciente>[] = [
  {
    accessorKey: 'url_video',
    header: 'Vídeo',
    cell: ({ row }) => {
      const videoId = extractYouTubeID(row.original.url_video)
      return videoId ? (
        <div className="w-40 aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null
    },
  },
  {
    accessorKey: 'nome',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nome do Exercício
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'descricao',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Descrição
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <ActionCell exercicio={row.original} />,
  },
]
