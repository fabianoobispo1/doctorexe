'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useMutation, useQuery } from 'convex/react'
import { useEffect } from 'react'

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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

const formSchema = z.object({
  dataAvaliacao: z.string(),
  altura: z.number(),
  peso: z.number(),
  pressaoArterial: z.string(),
  frequenciaCardiaca: z.number(),
  diagnosticoFisioterapeutico: z.string(),
  semiologia: z.string(),
  testesEspecificos: z.string(),
  escalaEva: z.number().min(0).max(10),
  objetivosTratamento: z.string(),
  recursosTerapeuticos: z.string(),
  planoTratamento: z.string(),
})

type FormValues = z.infer<typeof formSchema>

interface AvaliacaoFormProps {
  pacienteId: string
  avaliacaoId?: string
  isEditing?: boolean
}

export function AvaliacaoForm({
  pacienteId,
  avaliacaoId,
  isEditing = false,
}: AvaliacaoFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const createAvaliacao = useMutation(api.avaliacoes.create)
  const updateAvaliacao = useMutation(api.avaliacoes.update)

  // Buscar dados da evolução se estiver editando
  const avaliacaoData = useQuery(
    api.avaliacoes.getAvaliacaoById,
    isEditing && avaliacaoId
      ? { avaliacaoId: avaliacaoId as Id<'avaliacaoFisio'> }
      : 'skip',
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataAvaliacao: new Date().toISOString().split('T')[0],
      altura: 0, // Add default values for all fields
      peso: 0,
      pressaoArterial: '',
      frequenciaCardiaca: 0,
      diagnosticoFisioterapeutico: '',
      semiologia: '',
      testesEspecificos: '',
      escalaEva: 0,
      objetivosTratamento: '',
      recursosTerapeuticos: '',
      planoTratamento: '',
    },
  })

  // Preencher o formulário com os dados existentes quando estiver editando
  useEffect(() => {
    if (isEditing && avaliacaoData) {
      const dataFormatada = new Date(avaliacaoData.dataAvaliacao)
        .toISOString()
        .split('T')[0]

      form.reset({
        dataAvaliacao: dataFormatada,
        altura: avaliacaoData.altura,
        peso: avaliacaoData.peso,
        pressaoArterial: avaliacaoData.pressaoArterial,
        frequenciaCardiaca: avaliacaoData.frequenciaCardiaca,
        diagnosticoFisioterapeutico: avaliacaoData.diagnosticoFisioterapeutico,
        semiologia: avaliacaoData.semiologia,
        testesEspecificos: avaliacaoData.testesEspecificos,
        escalaEva: avaliacaoData.escalaEva,
        objetivosTratamento: avaliacaoData.objetivosTratamento,
        recursosTerapeuticos: avaliacaoData.recursosTerapeuticos,
        planoTratamento: avaliacaoData.planoTratamento,
      })
    }
  }, [avaliacaoData, form, isEditing])

  async function onSubmit(data: FormValues) {
    try {
      if (isEditing && avaliacaoId) {
        await updateAvaliacao({
          avaliacaoId: avaliacaoId as Id<'avaliacaoFisio'>,
          dataAvaliacao: Date.now(),
          altura: data.altura,
          peso: data.peso,
          pressaoArterial: data.pressaoArterial,
          frequenciaCardiaca: data.frequenciaCardiaca,
          diagnosticoFisioterapeutico: data.diagnosticoFisioterapeutico,
          apresentacaoPaciente: JSON.stringify({}),
          examesComplementares: JSON.stringify({}),
          inspecaoPalpacao: JSON.stringify({}),
          semiologia: data.semiologia,
          testesEspecificos: data.testesEspecificos,
          escalaEva: data.escalaEva,
          objetivosTratamento: data.objetivosTratamento,
          recursosTerapeuticos: data.recursosTerapeuticos,
          planoTratamento: data.planoTratamento,
          updated_at: Date.now(),
        })

        toast({
          title: 'Sucesso',
          description: 'Avaliação atualizada com sucesso!',
        })

        router.push(`/dashboard/pacientes/${pacienteId}/avaliacoes`)
      } else {
        const avaliacaoData = {
          dataAvaliacao: Date.now(),
          altura: data.altura,
          peso: data.peso,
          pressaoArterial: data.pressaoArterial,
          frequenciaCardiaca: data.frequenciaCardiaca,
          diagnosticoFisioterapeutico: data.diagnosticoFisioterapeutico,
          apresentacaoPaciente: JSON.stringify({}),
          examesComplementares: JSON.stringify({}),
          inspecaoPalpacao: JSON.stringify({}),
          semiologia: data.semiologia,
          testesEspecificos: data.testesEspecificos,
          escalaEva: data.escalaEva,
          objetivosTratamento: data.objetivosTratamento,
          recursosTerapeuticos: data.recursosTerapeuticos,
          planoTratamento: data.planoTratamento,
          created_at: Date.now(),
          updated_at: Date.now(),
          pacienteId: pacienteId as Id<`paciente`>,
        }
        await createAvaliacao(avaliacaoData)

        toast({
          title: 'Sucesso',
          description: 'Avaliação cadastrada com sucesso!',
        })

        router.push(`/dashboard/pacientes/${pacienteId}/avaliacoes`)
      }
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
            {/* Dados Básicos */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium mb-4">Dados da Avaliação</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dataAvaliacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Avaliação</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sinais Vitais */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium mb-4">Sinais Vitais</h3>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="altura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura (m)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="peso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pressaoArterial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pressão Arterial</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="120/80" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequenciaCardiaca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Freq. Cardíaca (bpm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Avaliação Clínica */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium mb-4">Avaliação Clínica</h3>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="diagnosticoFisioterapeutico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnóstico Fisioterapêutico</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="semiologia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semiologia</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="testesEspecificos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testes Específicos</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2 mb-2">
                <h3 className="text-lg font-medium mb-4">
                  Escala de Dor (EVA)
                </h3>
                <FormField
                  control={form.control}
                  name="escalaEva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensidade da Dor</FormLabel>
                      <FormControl>
                        <ScrollArea className="w-full">
                          <div className="flex gap-1 pb-4">
                            {[...Array(11)].map((_, index) => (
                              <Button
                                key={index}
                                type="button"
                                className={`
                  w-8 md:w-12 h-12 font-bold transition-all
                  ${field.value === index ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'}
                  ${
                    index === 0
                      ? 'bg-green-400 hover:bg-green-500'
                      : index <= 3
                        ? 'bg-yellow-300 hover:bg-yellow-400'
                        : index <= 7
                          ? 'bg-orange-400 hover:bg-orange-500'
                          : 'bg-red-500 hover:bg-red-600'
                  }
                  ${field.value === index ? 'opacity-100' : 'opacity-70'}
                `}
                                onClick={() => field.onChange(index)}
                              >
                                {index}
                              </Button>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </FormControl>
                      <div className="mt-4 flex flex-col md:flex-row gap-2 justify-start text-sm text-muted-foreground">
                        <span className="text-green-500">Sem dor (0)</span>
                        <span className="text-yellow-500">Dor leve (1-3)</span>
                        <span className="text-orange-500">
                          Dor moderada (4-7)
                        </span>
                        <span className="text-red-500">Dor intensa (8-10)</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Plano de Tratamento */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium mb-4">Plano de Tratamento</h3>
              <div className="grid gap-4 md:grid-cols-1">
                <FormField
                  control={form.control}
                  name="objetivosTratamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivos do Tratamento</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recursosTerapeuticos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recursos Terapêuticos</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="planoTratamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plano de Tratamento</FormLabel>
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
                  router.push(`/dashboard/pacientes/${pacienteId}/avaliacoes`)
                }
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Avaliação</Button>
            </div>
          </div>
        </form>
      </Form>
    </ScrollArea>
  )
}
