'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AxiosError } from 'axios'
import { useState } from 'react'

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
import { extractYouTubeID } from '@/lib/utils'

const formSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string(),
  url_img: z.string(),
  url_video: z.string(),
})

type FormValues = z.infer<typeof formSchema>

export function ExercicioForm() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const { data: session } = useSession()
  const [videoId, setVideoId] = useState<string | null>(null)

  const handleVideoUrlChange = (url: string) => {
    const id = extractYouTubeID(url)
    setVideoId(id)
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      url_img: '',
      url_video: '',
    },
  })

  async function onSubmit(data: FormValues) {
    console.log(data)
    setLoading(true)

    if (session) {
      const dataToSend = {
        nome: data.nome,
        descricao: data.descricao,
        url_img: data.url_img,
        url_video: data.url_video,
      }

      try {
        if (session) {
          const response = await api.post(
            '/doctorexe/exercicios/registrar',
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

    router.push('/dashboard/exercicios')
  }

  return (
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
                  <Input placeholder="Nome do exercicio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>Descrição do exercicio</FormLabel>
                <FormControl>
                  <Input placeholder="..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url_video"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>URL do Vídeo (YouTube)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cole a URL do vídeo do YouTube"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleVideoUrlChange(e.target.value)
                    }}
                  />
                </FormControl>
                {videoId && (
                  <div className="mt-4 aspect-video w-full max-w-[560px]">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/exercicios')}
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
  )
}
