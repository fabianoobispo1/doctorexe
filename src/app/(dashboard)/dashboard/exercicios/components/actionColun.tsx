import { MoreHorizontal } from 'lucide-react'
import { useMutation } from 'convex/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import type { ExercicioProps } from '@/types'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

export function ActionCell({ exercicio }: { exercicio: ExercicioProps }) {
  const deleteExercise = useMutation(api.exercicio.remove)

  const handleDelete = async (id: Id<'exercise'>) => {
    try {
      await deleteExercise({ exerciseId: id })
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
