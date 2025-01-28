'use client'
import * as z from 'zod'
import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, formatCPF } from '@/lib/utils'
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
import { api } from '@/lib/axios'

import { ImageUpload } from './image-upload'

const formSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, { message: 'Nome precisa ser preenchido.' }),
  email: z.string().email({ message: 'Digite um email valido.' }),
  cpf: z
    .string({
      required_error: 'CPF é obrigatório',
      invalid_type_error: 'Formato de CPF inválido',
    })
    .min(1, 'CPF é obrigatório'),
  data_nascimento: z.preprocess(
    (val) => (val === null ? undefined : val), // Transforma null em undefined
    z.date({
      required_error: 'A data de nascimento precisa ser preenchida.',
    }),
  ),
  image: z
    .object({
      url: z.string(),
      key: z.string(),
    })
    .nullable()
    .optional(),
  /*  data_nascimento: z.preprocess(
      (val) => (val === null ? undefined : val), // Transforma null em undefined
      z.date({
        required_error: 'A data de nascimento precisa ser preenchida.',
      }),
    ),
  
    image: z.string().optional(),
    provider: z.string().optional(),
    oldPassword: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(), */
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
    data_nascimento: undefined,
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
      try {
        const response = await api.post('/doctorexe/perfil/id', {
          id: session.user.id,
        })
        console.log('carregou usuario')
        console.log(response.data.doctorExeUsuario)

        if (!response) {
          console.error('Erro ao buscar os dados do usuário:')
          return
        }

        if (response.data.doctorExeUsuario.provider !== 'credentials') {
          setBloqueioProvider(true)
        }

        form.reset({
          id: response.data.doctorExeUsuario.id,
          nome: response.data.doctorExeUsuario.nome,
          email: response.data.doctorExeUsuario.email,
          data_nascimento: response.data.doctorExeUsuario.data_nascimento
            ? new Date(response.data.doctorExeUsuario.data_nascimento)
            : undefined,
          cpf: response.data.doctorExeUsuario.cpf,
          image: response.data.doctorExeUsuario.image
            ? {
                url: response.data.doctorExeUsuario.image,
                key: response.data.doctorExeUsuario.image_key,
              }
            : null,

          /*  
        
          oldPassword: '',
          password: '',
          confirmPassword: '', */
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
      data_nascimento: data.data_nascimento
        ? data.data_nascimento.toISOString()
        : null,

      image: data.image?.url,
      image_key: data.image?.key,
      /*  data_nascimento: timestamp,
      provider: data.provider,
      password,
      image: data.image, */
    }
    console.log(dataToSend)

    try {
      if (session) {
        const response = await api.patch(
          '/doctorexe/perfil/update',
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
      loadUser()
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
                    value={field.value ?? null}
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
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="000.000.000-00"
                      value={value || ''}
                      onChange={(e) => onChange(formatCPF(e.target.value))}
                      {...field}
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
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
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
