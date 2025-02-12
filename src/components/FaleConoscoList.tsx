'use client'
import { useCallback, useEffect, useState } from 'react'
import { Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { AxiosError } from 'axios'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'

import { LoadingButton } from './ui/loading-button'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { Spinner } from './ui/spinner'

interface FaleConoscoListProps {
  id: string
  email: string
  nome: string
  telefone: string
  mensagem: string
  isCompleted: boolean
  created_at: number
  updated_at: number
}
export function FaleConoscoList() {
  const [faleConosco, setFaleConosco] = useState<FaleConoscoListProps[]>([])

  const [loadingTodo, setLoadingTodo] = useState<boolean>(false)

  const { toast } = useToast()

  const { data: session } = useSession()

  const loadTodos = useCallback(async () => {
    if (session) {
      try {
        if (session) {
          const response = await api.get('/doctorexelistarfaleconosco', {
            headers: {
              Authorization: `Bearer ${session.user.apiToken}`,
            },
          })
          setFaleConosco(response.data.faleConoscoDoctorexe)
        }
      } catch (error: unknown) {
        console.log(error)
        if (error instanceof AxiosError) {
          toast({
            title: 'Erro',
            variant: 'destructive',
            description: error.response?.data?.message,
          })
        } else {
          toast({
            title: 'Erro',
            variant: 'destructive',
            description: 'Erro Interno',
          })
        }
      }
    }
  }, [session, toast])

  useEffect(() => {
    if (session) {
      loadTodos()
    }
  }, [loadTodos, session])

  const toggleTodo = async (id: string) => {
    setLoadingTodo(true)

    if (session) {
      try {
        if (session) {
          await api.get(`/doctorexechecktodo/${id}`, {
            headers: {
              Authorization: `Bearer ${session.user.apiToken}`,
            },
          })
        }
        /*        toast({
          title: 'ok',
          description: 'Alterado com sucesso.',
        }) */
      } catch (error: unknown) {
        console.log(error)
        if (error instanceof AxiosError) {
          toast({
            title: 'Erro',
            variant: 'destructive',
            description: error.response?.data?.message,
          })
        } else {
          toast({
            title: 'Erro',
            variant: 'destructive',
            description: 'Erro Interno',
          })
        }
      }
    }

    loadTodos()
    setLoadingTodo(false)
  }

  const removeTodo = async (id: string) => {
    setLoadingTodo(true)

    if (session) {
      try {
        if (session) {
          await api.delete(`/doctorexeremoverfaleconosco/${id}`, {
            headers: {
              Authorization: `Bearer ${session.user.apiToken}`,
            },
          })
        }
        toast({
          title: 'ok',
          description: 'Removido com sucesso.',
        })
      } catch (error: unknown) {
        console.log(error)
        if (error instanceof AxiosError) {
          toast({
            title: 'Erro',
            variant: 'destructive',
            description: error.response?.data?.message,
          })
        } else {
          toast({
            title: 'Erro',
            variant: 'destructive',
            description: 'Erro Interno',
          })
        }
      }
    }

    loadTodos()
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
              {/*    <TableHead className="text-center">Feito</TableHead> */}
              <TableHead className="text-center">Criado em</TableHead>
              <TableHead className="text-center">Opções</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {faleConosco ? (
              faleConosco.map((faleConosco) => (
                <TableRow key={faleConosco.id}>
                  <TableCell>{faleConosco.nome}</TableCell>
                  <TableCell>{faleConosco.email}</TableCell>
                  <TableCell>{faleConosco.telefone}</TableCell>
                  <TableCell>{faleConosco.mensagem}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={faleConosco.isCompleted}
                      onCheckedChange={() => toggleTodo(faleConosco.id)}
                    />
                  </TableCell>
                  {/*         <TableCell className="text-center">
                    {new Date(faleConosco.created_at).toLocaleDateString()}
                  </TableCell> */}
                  <TableCell className="flex items-center justify-center gap-2">
                    {/*  <LoadingButton
                      className="w-32"
                      loading={loadingTodo}
                      onClick={() => toggleTodo(faleConosco.id)}
                    >
                      {faleConosco.isCompleted ? 'Desfazer' : 'Completo'}
                    </LoadingButton> */}
                    <LoadingButton
                      loading={loadingTodo}
                      variant={'destructive'}
                      onClick={() => removeTodo(faleConosco.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <Spinner />
            )}
          </TableBody>
        </Table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
