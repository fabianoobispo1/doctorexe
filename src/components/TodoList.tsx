'use client'
import { useCallback, useEffect, useState } from 'react'
import { Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { AxiosError } from 'axios'

import { Input } from '@/components/ui/input'
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

interface Todo {
  id: string
  text: string
  isCompleted: boolean
  created_at: number
  updated_at: number
  userId: string
}
export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  const [newTodo, setNewTodo] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const [loadingTodo, setLoadingTodo] = useState<boolean>(false)

  const { toast } = useToast()

  const { data: session } = useSession()

  const loadTodos = useCallback(async () => {
    if (session) {
      try {
        if (session) {
          const response = await api.get('/doctorexelistartodos', {
            headers: {
              Authorization: `Bearer ${session.user.apiToken}`,
            },
          })
          setTodos(response.data.TodoDoctorexe)
        }
        toast({
          title: 'ok',
          description: 'Cadastro alterado.',
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
  }, [session, toast])

  useEffect(() => {
    if (session) {
      loadTodos()
    }
  }, [loadTodos, session])

  const addTodo = async () => {
    setLoading(true)
    if (newTodo.trim() === '') {
      setLoading(false)
      return
    }

    if (session) {
      const dataToSend = {
        text: newTodo,
      }

      try {
        if (session) {
          const response = await api.post(
            '/doctorexeregistratodo',
            dataToSend,
            {
              headers: {
                Authorization: `Bearer ${session.user.apiToken}`,
              },
            },
          )
          console.log(response)
        }
        toast({
          title: 'ok',
          description: 'Cadastro alterado.',
        })
      } catch (error: unknown) {
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

      setNewTodo('')
      setLoading(false)
      loadTodos()
    }
  }

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
          await api.delete(`/doctorexeremovertodo/${id}`, {
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
      <div className="flex items-center">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Adicionar nova tarefa"
        />
        <LoadingButton loading={loading} onClick={addTodo} className="ml-2">
          Adicionar
        </LoadingButton>
      </div>

      <ScrollArea className="h-[calc(80vh-220px)] w-full overflow-x-auto rounded-md border">
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Tarefa</TableHead>
              <TableHead className="text-center">Completou</TableHead>
              <TableHead className="text-center">Criado em</TableHead>
              <TableHead className="text-center">Opções</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {todos ? (
              todos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell>{todo.text}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={todo.isCompleted}
                      onCheckedChange={() => toggleTodo(todo.id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(todo.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <LoadingButton
                      className="w-32"
                      loading={loadingTodo}
                      onClick={() => toggleTodo(todo.id)}
                    >
                      {todo.isCompleted ? 'Desfazer' : 'Completo'}
                    </LoadingButton>
                    <LoadingButton
                      loading={loadingTodo}
                      variant={'destructive'}
                      onClick={() => removeTodo(todo.id)}
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
