'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatPhoneNumber } from '@/lib/utils'

export type Paciente = {
  id: string
  nome: string
  dataNascimento: string
  telefone: string
  email?: string
  endereco: string
  created_at: string
}

export const columns: ColumnDef<Paciente>[] = [
  {
    accessorKey: 'nome',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'empresa',
    header: 'Empresa',
    cell: ({ row }) => {
      return row.getValue('empresa')
    },
  },

  {
    accessorKey: 'dataNascimento',
    header: 'Data Nascimento',
    cell: ({ row }) => {
      const date = new Date(row.getValue('dataNascimento'))
      return date.toLocaleDateString('pt-BR')
    },
  },
  {
    accessorKey: 'telefone',
    header: 'Telefone',
    cell: ({ row }) => {
      return formatPhoneNumber(row.getValue('telefone'))
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return row.getValue('email') || 'Não informado'
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const paciente = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/dashboard/pacientes/${paciente.id}`}>
                Ver detalhes
              </Link>
            </DropdownMenuItem>
            {/*   <DropdownMenuItem>
              <Link href={`/dashboard/pacientes/${paciente.id}/editar`}>
                Editar ficha
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <Link href={`/dashboard/pacientes/${paciente.id}/avaliacoes`}>
                Avaliações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/pacientes/${paciente.id}/historico`}>
                Histórico
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
