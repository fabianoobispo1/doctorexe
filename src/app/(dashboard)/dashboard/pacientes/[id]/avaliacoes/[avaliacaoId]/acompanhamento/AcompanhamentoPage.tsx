'use client'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import type { Doc, Id } from '@/convex/_generated/dataModel'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

interface AvaliacoesPageProps {
  idPaciente: string
  idAvaliacao: string
}

export default function AcompanhementoPage({
  idPaciente,
  idAvaliacao,
}: AvaliacoesPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [evolucaoToDelete, setEvolucaoToDelete] =
    useState<Id<'evolucao'> | null>(null)

  const evolucoes = useQuery(api.evolucao.getEvolucaoByAvaliacao, {
    avaliacaoId: idAvaliacao as Id<'avaliacaoFisio'>,
  }) as Doc<'evolucao'>[] | undefined

  const removeEvolucao = useMutation(api.evolucao.remove)

  const handleDeleteClick = (evolucaoId: Id<'evolucao'>) => {
    setEvolucaoToDelete(evolucaoId)
    setIsDeleteDialogOpen(true)
  }

  const handleEditClick = (evolucaoId: Id<'evolucao'>) => {
    router.push(
      `/dashboard/pacientes/${idPaciente}/avaliacoes/${idAvaliacao}/acompanhamento/editar/${evolucaoId}`,
    )
  }

  const confirmDelete = async () => {
    if (!evolucaoToDelete) return

    try {
      await removeEvolucao({ evolucaoId: evolucaoToDelete })
      toast({
        title: 'Sucesso',
        description: 'Consulta removida com sucesso',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a consulta',
        variant: 'destructive',
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setEvolucaoToDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/pacientes/${idPaciente}/avaliacoes`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Acompanhamento</h1>
        </div>
        <Link
          href={`/dashboard/pacientes/${idPaciente}/avaliacoes/${idAvaliacao}/acompanhamento/nova`}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Consulta
          </Button>
        </Link>
      </div>

      {Array.isArray(evolucoes) && evolucoes.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-170px)]  w-full pr-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {evolucoes.map((evolucao) => (
              <Card key={evolucao._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Consulta do dia</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(evolucao.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleEditClick(evolucao._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(evolucao._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between pb-4">
                    {evolucao.descricao}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="mt-2 text-lg font-semibold">
              Nenhuma registro encontrado
            </h3>
          </div>
        </Card>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta consulta? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
