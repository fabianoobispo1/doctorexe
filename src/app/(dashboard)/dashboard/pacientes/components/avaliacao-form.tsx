'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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

const formSchema = z.object({
  dataAvaliacao: z.string(),
  // Identificação
  nome: z.string(),
  dataNascimento: z.string(),
  telefone: z.string(),
  sexo: z.string(),
  cidade: z.string(),
  bairro: z.string(),
  empresa: z.string(),
  enderecoResidencial: z.string(),
  enderecoComercial: z.string(),
  naturalidade: z.string(),
  estadoCivil: z.string(),
  diagnosticoClinico: z.string(),
  diagnosticoFisioterapeutico: z.string(),
  escalaEva: z.number().min(0).max(10),

  // Avaliação
  historiaClinica: z.string(),
  queixaPrincipal: z.string(),
  habitosVida: z.string(),
  hma: z.string(),
  hmp: z.string(),
  antecedentePessoal: z.string(),
  antecedenteFamiliar: z.string(),
  tratamentosRealizados: z.string(),
  altura: z.number(),
  peso: z.number(),
  pressaoArterial: z.string(),
  frequenciaCardiaca: z.number(),

  // Exame Clínico
  apresentacaoPaciente: z.object({
    deambulando: z.boolean(),
    deambulandoComApoio: z.boolean(),
    cadeiraRodas: z.boolean(),
    internado: z.boolean(),
    orientado: z.boolean(),
  }),
})

type FormValues = z.infer<typeof formSchema>

interface AvaliacaoFormProps {
  pacienteId: string
}

export function AvaliacaoForm({ pacienteId }: AvaliacaoFormProps) {
  const router = useRouter()
  console.log({ pacienteId })
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataAvaliacao: new Date().toISOString().split('T')[0],
      apresentacaoPaciente: {
        deambulando: false,
        deambulandoComApoio: false,
        cadeiraRodas: false,
        internado: false,
        orientado: false,
      },
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      // Aqui virá a integração com a API
      console.log({ pacienteId, ...data })
      toast.success('Avaliação cadastrada com sucesso!')
      // router.push(`/pacientes/${pacienteId}/avaliacoes`)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao cadastrar avaliação')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Seção: Dados Básicos */}
          <div className="col-span-2">
            <h3 className="text-lg font-medium mb-4">Dados Básicos</h3>
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

              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataNascimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Seção: Dados Clínicos */}
          <div className="col-span-2">
            <h3 className="text-lg font-medium mb-4">Dados Clínicos</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="diagnosticoClinico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnóstico Clínico</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="escalaEva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escala EVA (0-10)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="10"
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

          {/* Seção: Sinais Vitais */}
          <div className="col-span-2">
            <h3 className="text-lg font-medium mb-4">Sinais Vitais</h3>
            <div className="grid gap-4 md:grid-cols-4">
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

          {/* Botões de ação */}
          <div className="col-span-2 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/pacientes/${pacienteId}/avaliacoes`)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar Avaliação</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
