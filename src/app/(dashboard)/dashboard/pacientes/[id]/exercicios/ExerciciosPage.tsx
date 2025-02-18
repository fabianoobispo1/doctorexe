'use client'
import Link from 'next/link'
import { ArrowLeft, PlayCircle, Plus } from 'lucide-react'
import { useQuery } from 'convex/react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VideoDialog } from '@/components/VideoDialog'
interface ExerciciosPageProps {
  idPaciente: string
}

export default function ExerciciosPage({ idPaciente }: ExerciciosPageProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const exercises = useQuery(api.exercicio.listByPatientId, {
    patientId: idPaciente as Id<'paciente'>,
  })

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl)
    setIsVideoOpen(true)
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
        <ScrollArea className="h-[calc(100vh-170px)]  w-full pr-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exercises &&
              exercises.map((exercise) => (
                <Card key={exercise?._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{exercise?.nome}</span>
                      {exercise?.url_video && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVideoClick(exercise.url_video)}
                        >
                          <PlayCircle className="h-6 w-6 text-primary" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </ScrollArea>
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

      <VideoDialog
        isOpen={isVideoOpen}
        onOpenChange={setIsVideoOpen}
        videoUrl={selectedVideo}
      />
    </div>
  )
}
