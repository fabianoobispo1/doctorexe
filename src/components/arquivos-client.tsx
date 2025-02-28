'use client'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { PlusCircle, FileIcon, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import type { Id } from '@/convex/_generated/dataModel'
import { MinioStorageProvider } from '@/services/storage/implementations/minio'

import { UploadArquivoForm } from './upload-arquivo-form'

export const ArquivosClient = () => {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const storage = new MinioStorageProvider()

  const arquivos = useQuery(api.arquivos.listarArquivos) || []
  const pacientes = useQuery(api.paciente.getAll) || []
  const deletarArquivo = useMutation(api.arquivos.deletarArquivo)

  const handleDelete = async (id: Id<'arquivos'>, key: string) => {
    try {
      await storage.delete(key)
      await deletarArquivo({ id })
      toast({
        title: 'Arquivo excluído',
        description: 'O arquivo foi excluído com sucesso',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao excluir',
        description: 'Ocorreu um erro ao excluir o arquivo',
        variant: 'destructive',
      })
    }
  }

  const getPacienteNome = (pacienteId: string) => {
    const paciente = pacientes.find((p) => p._id === pacienteId)
    return paciente ? paciente.nome : 'Paciente não encontrado'
  }

  const formattedPacientes = pacientes.map((paciente) => ({
    id: paciente._id,
    nome: paciente.nome,
  }))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Lista de Arquivos</h2>
          <p className="text-sm text-muted-foreground">
            {arquivos.length}{' '}
            {arquivos.length === 1
              ? 'arquivo encontrado'
              : 'arquivos encontrados'}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Adicionar Arquivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Arquivo</DialogTitle>
              <DialogDescription>
                Selecione um arquivo para upload e associe a um paciente.
              </DialogDescription>
            </DialogHeader>
            <UploadArquivoForm
              onSuccess={() => setOpen(false)}
              pacientes={formattedPacientes}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Adicionado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {arquivos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum arquivo encontrado
                </TableCell>
              </TableRow>
            )}
            {arquivos.map((arquivo) => (
              <TableRow key={arquivo._id}>
                <TableCell className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4" />
                  <a
                    href={arquivo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {arquivo.nome}
                  </a>
                </TableCell>
                <TableCell>{getPacienteNome(arquivo.pacienteId)}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(arquivo.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(arquivo._id, arquivo.key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
