'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { hash } from 'bcryptjs'

import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/convex/_generated/api'
import { formatCPF } from '@/lib/utils'

import { LoadingButton } from '../ui/loading-button'

const formSchema = z
  .object({
    nome: z.string().min(3, { message: 'Digite seu nome.' }),
    email: z.string().email({ message: 'Digite um email valido.' }),
    password: z.string().min(8, { message: 'Senha obrigatoria, min 8' }),
    confirmPassword: z.string().min(8, { message: 'Senha obrigatoria, min 8' }),
    cpf: z.string().min(11, { message: 'CPF inválido' }),
    dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coecindem',
    path: ['confirmPassword'],
  })

type UserFormValue = z.infer<typeof formSchema>

interface UserRegisterFormProps {
  setButton: (value: string) => void
}

export default function UserRegisterForm({ setButton }: UserRegisterFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const defaultValues = {
    email: '',
    password: '',
    nome: '',
    confirmPassword: '',
    cpf: '',
    dataNascimento: '',
  }
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true)

    const existingUserByEmail = await fetchQuery(api.user.getByEmail, {
      email: data.email,
    })

    if (existingUserByEmail) {
      toast({
        title: 'Erro',
        variant: 'destructive',
        description: 'Email já cadastrado.',
      })
      setLoading(false)
      return
    }
    try {
      const hashedPassword = await hash(data.password, 6)
      const user = await fetchMutation(api.user.create, {
        password: hashedPassword,
        provider: 'credentials',
        email: data.email,
        role: 'user',
        image: 'empty',
        nome: data.nome,
        cpf: formatCPF(data.cpf),
        data_nascimento: new Date(data.dataNascimento).getTime(),
      })

      if (!user) {
        toast({
          title: 'Erro',
          variant: 'destructive',
          description: 'Usuario nao criado.',
        })
        setLoading(false)
        return
      }

      toast({
        title: 'OK',
        description: 'Usuário criado com sucesso. Por favor, faça login.',
      })

      setLoading(false)
      setButton('Cadastrar')
    } catch (error) {
      console.error(error)

      toast({
        title: 'Erro',
        variant: 'destructive',
        description: 'Ocorreu um erro ao criar o usuário.',
      })
      setLoading(false)
    }

    setLoading(false)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    type="nome"
                    placeholder="Digite seu nome..."
                    disabled={loading}
                    {...field}
                  />
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
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="000.000.000-00"
                    value={formatCPF(field.value)}
                    onChange={(e) => field.onChange(formatCPF(e.target.value))}
                  />
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
            name="password"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder=""
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>Comfirmar senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder=""
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            loading={loading}
            className="ml-auto w-full"
            type="submit"
          >
            {loading ? 'Carregando' : 'Cadastrar'}
          </LoadingButton>
        </form>
      </Form>
    </>
  )
}
