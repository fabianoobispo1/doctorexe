'use client'
import * as z from 'zod'
import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { fetchMutation, fetchQuery } from 'convex/nextjs'

import { formatCPF } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

import { ImageUpload } from './image-upload'

const formSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, { message: 'Nome precisa ser preenchido.' }),
  email: z.string().email({ message: 'Digite um email valido.' }),
  cpf: z.string().min(11, { message: 'CPF inválido' }),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  image: z
    .object({
      url: z.string().optional(),
      key: z.string().optional(),
    })
    .nullable()
    .optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

export const PerfilForm: React.FC = () => {
  const { data: session } = useSession()
  const [loadingData, setLoadingData] = useState(true)
  const [bloqueioProvider, setBloqueioProvider] = useState(false)
  const [loading, setLoading] = useState(false)

  const [carregou, setiscarregou] = useState(false)
  const { toast } = useToast()

  const defaultValues = {
    id: '',
    nome: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    image: null,
    /*  oldPassword: '',
    password: '',
    confirmPassword: '',
    provider: '', */
  }
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const loadUser = useCallback(async () => {
    setLoadingData(true)
    if (session) {
      console.log(session.user.id)
      try {
        const response = await fetchQuery(api.user.getById, {
          userId: session.user.id as Id<'user'>,
        })
        console.log(response)
        if (!response) {
          console.error('Erro ao buscar os dados do usuário:')
          return
        }

        if (response.provider !== 'credentials') {
          setBloqueioProvider(true)
        }
        console.log(response)
        form.reset({
          id: response._id,
          nome: response.nome,
          email: response.email,
          data_nascimento: response.data_nascimento
            ? new Date(response.data_nascimento).toISOString().split('T')[0]
            : '',
          cpf: response.cpf,
          image: response.image
            ? {
                url: response.image,
                key: response.image_key,
              }
            : null,
        })
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error)
      } finally {
        setLoadingData(false)
      }
    }
  }, [session, form])
  useEffect(() => {
    if (session) {
      if (!carregou) {
        loadUser()
        setiscarregou(true)
      }
    }
  }, [session, setiscarregou, carregou, loadUser])

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true)
    console.log('update')
    console.log(data)

    /*   let password = '' */
    /*    if (data.oldPassword) {
      const isMatch = await compare(data.oldPassword, passwordHash)

      if (!isMatch) {
        toast({
          title: 'Erro',
          variant: 'destructive',
          description: 'Senha antiga incorreta.',
        })
        setLoading(false)
        return
      }
      const newPassword = data.password
      if (newPassword) {
        password = await hash(newPassword, 6)
      }
    } */

    /* 
    const timestamp = data.data_nascimento
      ? new Date(data.data_nascimento).getTime()
      : 0 */

    const dataToSend = {
      email: data.email,
      nome: data.nome,
      cpf: data.cpf,
      data_nascimento: new Date(data.data_nascimento).getTime(),
      /*       image: data.image?.url,
      image_key: data.image?.key, */
      /*  data_nascimento: timestamp,
      provider: data.provider,
      password,
      image: data.image, */
    }
    console.log(dataToSend)

    await fetchMutation(api.user.UpdateUser, {
      userId: data.id as Id<'user'>,
      email: data.email,
      nome: data.nome,
      data_nascimento: new Date(data.data_nascimento).getTime(),
      cpf: data.cpf,
      image: data.image?.url,
      image_key: data.image?.key,
      /*   
      provider: data.provider,
     
      password, */
    })

    toast({
      title: 'ok',
      description: 'Cadastro alterado.',
    })
    loadUser()

    setLoading(false)
  }

  if (loadingData) {
    return <Spinner />
  }

  return (
    <ScrollArea className="h-[70vh] w-full px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    value={
                      field.value
                        ? {
                            url: field.value.url || '',
                            key: field.value.key || '',
                          }
                        : null
                    }
                    onChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className=" flex-col hidden">
                  <FormLabel>id</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading || bloqueioProvider}
                      placeholder="Email"
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
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="000.000.000-00"
                      value={formatCPF(field.value)}
                      onChange={(e) =>
                        field.onChange(formatCPF(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_nascimento"
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
            {/*         <FormField
              control={form.control}
              name="data_nascimento"
              render={({ field }) => (
                <DatePickerWithDropdown
                  label="Data Nascimento"
                  date={field.value || undefined} // Passa undefined se for null
                  setDate={(date) => field.onChange(date || null)} // Define null ao limpar
                />
              )}
            />

            {bloqueioProvider ? (
              <></>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha antiga</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="new-password"
                          type="password"
                          placeholder=""
                          disabled={loading || bloqueioProvider}
                          {...field}
                          name="new-password-field"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="password"
                          placeholder=""
                          disabled={loading || bloqueioProvider}
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
                    <FormItem>
                      <FormLabel>Comfirmar nova senha</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="password"
                          placeholder=""
                          disabled={loading || bloqueioProvider}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          
 */}
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Salvar
          </Button>
        </form>
      </Form>
    </ScrollArea>
  )
}
