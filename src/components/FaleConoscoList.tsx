'use client'
import { useState } from 'react'
import { Trash } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

import { LoadingButton } from './ui/loading-button'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { Spinner } from './ui/spinner'
import { Checkbox } from './ui/checkbox'

export function FaleConoscoList() {
  const [loadingTodo, setLoadingTodo] = useState<boolean>(false)

  const { toast } = useToast()

  // Usar useQuery do Convex para buscar dados
  const faleConosco = useQuery(api.faleConosco.getAll)

  // Mutations do Convex
  const toggleFaleConosco = useMutation(api.faleConosco.toggle)
  const removeFaleConosco = useMutation(api.faleConosco.remove)

  const handleToggle = async (id: Id<'faleConosco'>) => {
    setLoadingTodo(true)
    try {
      await toggleFaleConosco({ id })
      toast({
        title: 'Sucesso',
        description: 'Status alterado com sucesso',
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Erro',
        variant: 'destructive',
        description: 'Erro ao alterar status',
      })
    }
    setLoadingTodo(false)
  }

  const handleRemove = async (id: Id<'faleConosco'>) => {
    setLoadingTodo(true)
    try {
      await removeFaleConosco({ id })
      toast({
        title: 'Sucesso',
        description: 'Mensagem removida com sucesso',
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Erro',
        variant: 'destructive',
        description: 'Erro ao remover mensagem',
      })
    }
    setLoadingTodo(false)
  }

  return (
    <div className="space-y-8">
      <ScrollArea className="h-[calc(80vh-220px)] w-full overflow-x-auto rounded-md border">
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Nome</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Telefone</TableHead>
              <TableHead className="text-center">Mensagem</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Criado em</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {faleConosco ? (
              faleConosco.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.telefone}</TableCell>
                  <TableCell>{item.mensagem}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={item.isCompleted}
                      onCheckedChange={() => handleToggle(item._id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <LoadingButton
                      loading={loadingTodo}
                      variant={'destructive'}
                      onClick={() => handleRemove(item._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <Spinner />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
