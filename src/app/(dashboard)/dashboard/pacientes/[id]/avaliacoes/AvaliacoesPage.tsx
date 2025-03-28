'use client'
import Link from 'next/link'
import { ArrowLeft, Edit, Plus } from 'lucide-react'
import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import type { Doc, Id } from '@/convex/_generated/dataModel'

interface AvaliacoesPageProps {
  idPaciente: string
}

export default function AvaliacoesPage({ idPaciente }: AvaliacoesPageProps) {
  const avaliacoes = useQuery(api.avaliacoes.getByID, {
    pacienteId: idPaciente as Id<'paciente'>,
  }) as Doc<'avaliacaoFisio'>[] | undefined
  const router = useRouter()

  const handleEditClick = (avaliacaoId: Id<'avaliacaoFisio'>) => {
    router.push(
      `/dashboard/pacientes/${idPaciente}/avaliacoes/editar/${avaliacaoId}`,
    )
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/pacientes/${idPaciente}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Avaliações Físicas
          </h1>
        </div>
        <Link href={`/dashboard/pacientes/${idPaciente}/avaliacoes/nova`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Avaliação
          </Button>
        </Link>
      </div>

      {Array.isArray(avaliacoes) && avaliacoes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {avaliacoes.map((avaliacao) => (
            <Card key={avaliacao._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Avaliação Fisioterápica</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(avaliacao.dataAvaliacao).toLocaleDateString(
                        'pt-BR',
                      )}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary hover:bg-primary/10"
                      onClick={() => handleEditClick(avaliacao._id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pb-4">
                  <span className="text-sm text-muted-foreground">
                    EVA: {avaliacao.escalaEva}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/dashboard/pacientes/${idPaciente}/avaliacoes/${avaliacao._id}/evolucao`}
                  >
                    <Button variant="outline" size="sm">
                      Evolução
                    </Button>
                  </Link>

                  <Link
                    href={`/dashboard/pacientes/${idPaciente}/avaliacoes/${avaliacao._id}`}
                  >
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="mt-2 text-lg font-semibold">
              Nenhuma avaliação encontrada
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Comece criando uma nova avaliação para este paciente.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
