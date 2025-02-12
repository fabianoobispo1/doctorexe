'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/axios'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PacienteFormProps {
  pacienteId?: string
}
const formSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  sexo: z.string().min(1, 'Sexo é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  bairro: z.string().min(2, 'Bairro é obrigatório'),
  empresa: z.string().min(2, 'Empresa é obrigatória'),
  enderecoResidencial: z.string().min(5, 'Endereço residencial é obrigatório'),
  enderecoComercial: z.string().optional(),
  naturalidade: z.string().min(2, 'Naturalidade é obrigatória'),
  estadoCivil: z.string().min(2, 'Estado civil é obrigatório'),
})

type FormValues = z.infer<typeof formSchema>

export function PacienteForm({ pacienteId }: PacienteFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      dataNascimento: '',
      telefone: '',
      email: '',
      sexo: '',
      cidade: '',
      bairro: '',
      empresa: '',
      enderecoResidencial: '',
      enderecoComercial: '',
      naturalidade: '',
      estadoCivil: '',
    },
  })

  // Carregar dados do paciente quando houver um ID
  useEffect(() => {
    async function loadPaciente() {
      if (pacienteId && session) {
        try {
          const response = await api.get(`/doctorexe/pacientes/${pacienteId}`, {
            headers: {
              Authorization: `Bearer ${session.user.apiToken}`,
            },
          })

          const data = {
            ...response.data,
            dataNascimento: response.data.paciente.dataNascimento.split('T')[0],
          }

          form.reset(data)
        } catch (error) {
          console.log(error)
          toast({
            title: 'Erro',
            description: 'Erro ao carregar dados do paciente',
            variant: 'destructive',
          })
        }
      }
    }

    loadPaciente()
  }, [pacienteId, session, form, toast])

  async function onSubmit(data: FormValues) {
    // Aqui virá a integração com a API
    setLoading(true)

    if (session) {
      try {
        if (pacienteId) {
          // Edição - PUT
          console.log('Editando paciente:', data)
          /*  await api.put(`/doctorexe/pacientes/${paciente.id}`, data, {
            headers: {
              Authorization: `Bearer ${session.user.apiToken}`,
            },
          }) */
          toast({
            title: 'Sucesso',
            description: 'Paciente atualizado com sucesso.',
          })
        } else {
          // add
          const dataToSend = {
            nome: data.nome,
            dataNascimento: data.dataNascimento,
            telefone: data.telefone,
            email: data.email,
            sexo: data.sexo,
            cidade: data.cidade,
            bairro: data.bairro,
            empresa: data.empresa,
            enderecoResidencial: data.enderecoResidencial,
            enderecoComercial: data.enderecoComercial,
            naturalidade: data.naturalidade,
            estadoCivil: data.estadoCivil,
          }

          if (session) {
            const response = await api.post(
              '/doctorexe/pacientes',
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
            description: 'Cadastro realizado.',
          })
        }
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

      setLoading(false)
    }

    router.push('/dashboard/pacientes')
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pacientes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {pacienteId ? 'Editar' : 'Cadastrar'} paciente
        </h1>
      </div>
      <ScrollArea className="h-[calc(100vh-170px)]  w-full pr-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do paciente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem className="px-2">
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
                <FormItem className="px-2">
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Sexo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="empresa"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enderecoResidencial"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Endereço Residencial</FormLabel>
                  <FormControl>
                    <Input placeholder="Endereço Residencial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enderecoComercial"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Endereço Comercial</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Endereço Comercial (opcional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="naturalidade"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Naturalidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Naturalidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estadoCivil"
              render={({ field }) => (
                <FormItem className="px-2">
                  <FormLabel>Estado Civil</FormLabel>
                  <FormControl>
                    <Input placeholder="Estado Civil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/pacientes')}
              >
                Cancelar
              </Button>
              <Button disabled={loading} type="submit">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  )
}
