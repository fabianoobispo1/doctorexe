'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios from 'axios'

import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/axios'

import { LoadingButton } from '../ui/loading-button'
import { Textarea } from '../ui/textarea'

const formSchema = z.object({
  nome: z.string().min(3, { message: 'Digite seu nome.' }),
  email: z.string().email({ message: 'Digite um email valido.' }),
  telefone: z.string().min(3, { message: 'Digite sue telefone.' }),
  mensagem: z.string().min(8, { message: 'Senha obrigatoria, min 8' }),
})

type UserFormValue = z.infer<typeof formSchema>

export default function FaleConoscoForm() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const defaultValues = {
    email: '',
    telefone: '',
    nome: '',
    mensagem: '',
  }
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true)

    try {
      await api.post('/doctorexeregistrafaleconosco', {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        mensagem: data.mensagem,
      })

      toast({
        title: 'Sucesso',
        description: 'Mensagem enviada com sucesso!',
      })
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Erro ao enviar a mensagem.'
        : 'Erro ao enviar a mensagem.'

      toast({
        title: 'Erro',
        variant: 'destructive',
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">Fale Conosco</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="telefone"
                      placeholder="Telefone..."
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
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Sua mensagem"
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
      </div>
    </>
  )
}
