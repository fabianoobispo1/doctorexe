'use client'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { useQuery } from 'convex/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import type { Doc, Id } from '@/convex/_generated/dataModel'

interface AvaliacoesPageProps {
  idPaciente: string
  idAvaliacao: string
}

export default function AcompanhementoPage({
  idPaciente,
  idAvaliacao,
}: AvaliacoesPageProps) {
  const evolucoes = useQuery(api.evolucao.getEvolucaoByAvaliacao, {
    avaliacaoId: idAvaliacao as Id<'avaliacaoFisio'>,
  }) as Doc<'evolucao'>[] | undefined

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
          </Button>
        </Link>
      </div>

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
  )
}
