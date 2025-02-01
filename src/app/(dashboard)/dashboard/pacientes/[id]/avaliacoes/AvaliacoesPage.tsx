'use client'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'

interface AvaliacoesPageProps {
  idPaciente: string
}
interface Avaliacao {
  id: string
  dataAvaliacao: string
  diagnosticoFisioterapeutico: string
  escalaEva: number
  created_at: string
  updated_at: string
}

export default function AvaliacoesPage({ idPaciente }: AvaliacoesPageProps) {
  const { data: session } = useSession()
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[] | null>(null)

  const loadAvaliacoes = useCallback(
    async (id: string) => {
      if (session) {
        const response = await api.get('/doctorexe/avaliacao-fisio', {
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
          },
          params: {
            pacienteId: id,
            page: 1,
            perPage: 20,
          },
        })
        setAvaliacoes(response.data.avaliacoes)
      }
    },
    [session],
  )

  useEffect(() => {
    loadAvaliacoes(idPaciente)
  }, [loadAvaliacoes, idPaciente])

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

      {avaliacoes && avaliacoes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {avaliacoes.map((avaliacao) => (
            <Card key={avaliacao.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Avaliação Fisioterápica</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(avaliacao.dataAvaliacao).toLocaleDateString(
                      'pt-BR',
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    EVA: {avaliacao.escalaEva}
                  </span>
                  <Link
                    href={`/dashboard/pacientes/${idPaciente}/avaliacoes/${avaliacao.id}`}
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
