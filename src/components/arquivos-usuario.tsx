'use client'

import { useQuery, useMutation } from 'convex/react'
import { FileIcon, Trash2, Download } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'

import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import type { Id } from '@/convex/_generated/dataModel'
import { MinioStorageProvider } from '@/services/storage/implementations/minio'

export const ArquivosUsuario = () => {
  const { toast } = useToast()
  const storage = new MinioStorageProvider()
  const arquivos = useQuery(api.arquivos.listarArquivos) || []
  const deletarArquivo = useMutation(api.arquivos.deletarArquivo)

  const [arquivoParaExcluir, setArquivoParaExcluir] = useState<{
    id: Id<'arquivos'>
    key: string
  } | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleDeleteClick = (id: Id<'arquivos'>, key: string) => {
    setArquivoParaExcluir({ id, key })
    setConfirmDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!arquivoParaExcluir) return

    try {
      await storage.delete(arquivoParaExcluir.key)
      await deletarArquivo({ id: arquivoParaExcluir.id })
      toast({
        title: 'Arquivo excluído',
        description: 'O arquivo foi excluído com sucesso',
      })
      setConfirmDialogOpen(false)
      setArquivoParaExcluir(null)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao excluir',
        description: 'Ocorreu um erro ao excluir o arquivo',
        variant: 'destructive',
      })
    }
  }

  const downloadFile = async (url: string, filename: string) => {
    try {
      // Busca o arquivo como blob
      const response = await fetch(url)
      const blob = await response.blob()

      // Cria uma URL para o blob
      const blobUrl = URL.createObjectURL(blob)

      // Cria um elemento de link
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename

      // Adiciona ao documento, clica e remove
      document.body.appendChild(link)
      link.click()

      // Pequeno timeout para garantir que o download comece
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl) // Libera a memória
      }, 100)
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
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

                  {arquivo.nome}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(arquivo.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(arquivo.url, arquivo.nome)}
                    title="Baixar arquivo"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(arquivo._id, arquivo.key)}
                    title="Excluir arquivo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este arquivo? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
