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
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
  dataAvaliacao: z.string(),
  // Identificação
  nome: z.string(),
  dataNascimento: z.string(),
  telefone: z.string(),
  sexo: z.string(),
  cidade: z.string(),
  bairro: z.string(),
  profissao: z.string(),
  enderecoResidencial: z.string(),
  enderecoComercial: z.string(),
  naturalidade: z.string(),
  estadoCivil: z.string(),
  diagnosticoClinico: z.string(),
  diagnosticoFisioterapeutico: z.string(),

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
      router.push(`/pacientes/${pacienteId}/avaliacoes`)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao cadastrar avaliação')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
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

          {/* Dados Básicos */}
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apresentação do Paciente */}
          <div className="col-span-2">
            <h3 className="mb-4 text-lg font-medium">
              Apresentação do Paciente
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="apresentacaoPaciente.deambulando"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Deambulando</FormLabel>
                  </FormItem>
                )}
              />

              {/* Adicione os outros checkboxes de forma similar */}
            </div>
          </div>

          {/* História Clínica */}
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="historiaClinica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>História Clínica</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/pacientes/${pacienteId}/avaliacoes`)}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar Avaliação</Button>
        </div>
      </form>
    </Form>
  )
}
