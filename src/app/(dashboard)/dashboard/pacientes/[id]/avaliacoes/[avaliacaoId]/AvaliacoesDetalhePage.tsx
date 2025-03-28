'use client'
import Link from 'next/link'
import { ArrowLeft, Edit, Printer, Trash } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'

import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import type { Doc, Id } from '@/convex/_generated/dataModel'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AvaliacoesDetalhePageProps {
  idPaciente: string
  idAvaliacao: string
}

export default function AvaliacoesDetalhePage({
  idPaciente,
  idAvaliacao,
}: AvaliacoesDetalhePageProps) {
  const avaliacao = useQuery(api.avaliacoes.getAvaliacaoById, {
    avaliacaoId: idAvaliacao as Id<'avaliacaoFisio'>,
  })
  const evolucoes = useQuery(api.evolucao.getEvolucaoByAvaliacao, {
    avaliacaoId: idAvaliacao as Id<'avaliacaoFisio'>,
  }) as Doc<'evolucao'>[] | undefined
  const router = useRouter()
  const { toast } = useToast()
  const remove = useMutation(api.avaliacoes.remove)

  const handleRemove = async () => {
    try {
      await remove({ avaliacaoId: idAvaliacao as Id<'avaliacaoFisio'> })
      toast({
        title: 'Avaliação removida com sucesso',
        variant: 'default',
      })
      // Redirecionar para a lista de avaliações
      window.location.href = `/dashboard/pacientes/${idPaciente}/avaliacoes`
    } catch (error) {
      console.log(error)
      toast({
        title: 'Erro ao remover avaliação',
        variant: 'destructive',
      })
    }
  }

  const handleEditClick = (avaliacaoId: string) => {
    router.push(
      `/dashboard/pacientes/${idPaciente}/avaliacoes/editar/${avaliacaoId}`,
    )
  }

  if (!avaliacao) {
    return <div>Carregando...</div>
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
          <h1 className="text-3xl font-bold tracking-tight">
            Avaliação Física
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleEditClick(idAvaliacao)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="destructive" onClick={handleRemove}>
            <Trash className="mr-2 h-4 w-4" />
            Remover
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-170px)]  w-full pr-4">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Básicos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Data da Avaliação</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(avaliacao.dataAvaliacao).toLocaleDateString(
                    'pt-BR',
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Altura</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.altura}m
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Peso</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.peso}kg
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Pressão Arterial</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.pressaoArterial}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Frequência Cardíaca</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.frequenciaCardiaca} bpm
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico e Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <p className="text-sm font-medium">
                  Diagnóstico Fisioterapêutico
                </p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.diagnosticoFisioterapeutico}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Semiologia</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.semiologia}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Testes Específicos</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.testesEspecificos}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Escala EVA</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.escalaEva}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plano de Tratamento</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <p className="text-sm font-medium">Objetivos do Tratamento</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.objetivosTratamento}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Recursos Terapêuticos</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.recursosTerapeuticos}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Plano de Tratamento</p>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.planoTratamento}
                </p>
              </div>
            </CardContent>
          </Card>

          {Array.isArray(evolucoes) && evolucoes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {evolucoes.map((evolucao) => (
                <Card key={evolucao._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Consulta do dia</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(evolucao.data).toLocaleDateString('pt-BR')}
                      </span>
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
          ) : (
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <h3 className="mt-2 text-lg font-semibold">
                  Nenhuma registro encontrado
                </h3>
                {/*  <p className="mb-4 text-sm text-muted-foreground">
            Comece criando uma nova avaliação para este paciente.
          </p> */}
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
