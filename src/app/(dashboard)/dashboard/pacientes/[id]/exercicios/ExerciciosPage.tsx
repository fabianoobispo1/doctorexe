'use client'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'

interface ExerciciosPageProps {
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

export default function ExerciciosPage({ idPaciente }: ExerciciosPageProps) {
  const { data: session } = useSession()
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[] | null>(null)

  const loadAvaliacoes = useCallback(
    async (id: string) => {
      if (session) {
        const response = await api.get(`doctorexe/paciente/${id}/exercicios`, {
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
          },
        })
        console.log(response.data.exercises)
        setAvaliacoes(response.data.exercises)
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
            Lista de Exercícios
          </h1>
        </div>
        <Link href={`/dashboard/pacientes/${idPaciente}/exercicios/nova`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Exercícios
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
                      Adicionar Exer
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
              Nenhun exercício encontrado.
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Comece adicionando um exercício.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
