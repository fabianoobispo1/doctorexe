'use client'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { useQuery } from 'convex/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

interface ExerciciosPageProps {
  idPaciente: string
}

export default function ExerciciosPage({ idPaciente }: ExerciciosPageProps) {
  const exercises = useQuery(api.exercicio.listByPatientId, {
    patientId: idPaciente as Id<'paciente'>,
  })

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

      {exercises && exercises.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exercises &&
            exercises.map((exercise) => (
              <Card key={exercise?._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Exercício</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(
                        exercise?.created_at ?? Date.now(),
                      ).toLocaleDateString('pt-BR')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/dashboard/pacientes/${idPaciente}/exercicios/${exercise?._id}`}
                    >
                      <Button variant="outline" size="sm">
                        Ver Detalhes
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
              Nenhum exercício encontrado.
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
