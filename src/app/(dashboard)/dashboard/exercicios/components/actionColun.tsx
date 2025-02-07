import { MoreHorizontal } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { api } from '@/lib/axios'
export type Paciente = {
  id: string
  nome: string
  descricao: string
  url_img: string
  url_video: string
  created_at: string
}

export function ActionCell({ exercicio }: { exercicio: Paciente }) {
  const { data: session } = useSession()

  const handleDelete = async (id: string) => {
    try {
      if (session) {
        await api.delete(`/doctorexe/exercicio/${id}`, {
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
          },
        })
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDelete(exercicio.id)}>
          Remover
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
