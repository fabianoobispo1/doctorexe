'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useMutation } from 'convex/react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

const formSchema = z.object({
  data: z.string(),
  descricao: z.string(),
})

type FormValues = z.infer<typeof formSchema>

interface AcompanhamnetoFormProps {
  idPaciente: string
  idAvaliacao: string
}

export function AcompanhamnetoForm({
  idPaciente,
  idAvaliacao,
}: AcompanhamnetoFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const createEvolucao = useMutation(api.evolucao.create)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      // Aqui virá a integração com a API
      console.log({ idPaciente, ...data })

      const evolucaoData = {
        data: new Date(data.data).getTime(),
        descricao: data.descricao,
        created_at: Date.now(),
        avaliacaoId: idAvaliacao as Id<'avaliacaoFisio'>,
      }
      await createEvolucao(evolucaoData)

      toast({
        title: 'Sucesso',
        description: 'Avaliação cadastrada com sucesso!',
      })

      router.push(
        `/dashboard/pacientes/${idPaciente}/avaliacoes/${idAvaliacao}/acompanhamento`,
      )
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Erro Api Avaliação'
        : 'Erro Api Avaliação'

      toast({
        title: 'Erro',
        variant: 'destructive',
        description: errorMessage,
      })
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-170px)]  w-full pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div className="col-span-2">
              <h3 className="text-lg font-medium mb-4">
                Dados do acompanhamento
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Descição</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="col-span-2 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    `/dashboard/pacientes/${idPaciente}/avaliacoes/${idAvaliacao}/acompanhamento`,
                  )
                }
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Registro</Button>
            </div>
          </div>
        </form>
      </Form>
    </ScrollArea>
  )
}
