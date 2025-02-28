'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from 'convex/react'
import { Loader2 } from 'lucide-react'

import { api } from '@/convex/_generated/api'
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
import { DialogFooter } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MinioStorageProvider } from '@/services/storage/implementations/minio'
import type { Id } from '@/convex/_generated/dataModel'

const formSchema = z.object({
  arquivo: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: 'Arquivo é obrigatório' }),
  pacienteId: z.string({
    required_error: 'Selecione um paciente',
  }),
})

type UploadArquivoFormValues = z.infer<typeof formSchema>

interface UploadArquivoFormProps {
  onSuccess: () => void
  pacientes: {
    id: string
    nome: string
  }[]
}
export const UploadArquivoForm = ({
  onSuccess,
  pacientes,
}: UploadArquivoFormProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const adicionarArquivo = useMutation(api.arquivos.create)

  const storage = new MinioStorageProvider()

  const form = useForm<UploadArquivoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      arquivo: undefined,
      pacienteId: '',
    },
  })

  const onSubmit = async (data: UploadArquivoFormValues) => {
    try {
      setLoading(true)
      const arquivo = data.arquivo[0]

      const result = await storage.upload(arquivo)

      console.log('Resultado do upload:', result)
      console.log(data)
      // Salvar a referência no banco de dados
      await adicionarArquivo({
        nome: arquivo.name,
        url: result.url,
        key: result.key,
        pacienteId: data.pacienteId as Id<'paciente'>,
        created_at: Date.now(),
        updated_at: Date.now(),
      })

      toast({
        title: 'Arquivo adicionado',
        description: 'O arquivo foi adicionado com sucesso',
      })

      onSuccess()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao adicionar arquivo',
        description: 'Ocorreu um erro ao adicionar o arquivo',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pacienteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paciente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="arquivo"
          render={({ field }) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { value, ...fieldWithoutValue } = field

            return (
              <FormItem>
                <FormLabel>Arquivo</FormLabel>
                <FormControl>
                  <div className="relative">
                    {/* Input real (escondido) */}
                    <Input
                      {...fieldWithoutValue}
                      type="file"
                      onChange={(e) => {
                        field.onChange(e.target.files)
                        // Opcional: atualizar texto de visualização aqui
                      }}
                      className="sr-only" // Esconde visualmente mas mantém acessível
                      id="arquivo-input"
                    />

                    {/* Interface personalizada */}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="arquivo-input"
                        className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                      >
                        Selecionar arquivo
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {field.value && field.value[0]
                          ? field.value[0].name
                          : 'Nenhum arquivo selecionado'}
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Enviando...' : 'Enviar arquivo'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
