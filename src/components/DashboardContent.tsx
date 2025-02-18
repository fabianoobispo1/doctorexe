'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from 'convex/react'
import { ChevronDown, PlayCircle } from 'lucide-react'
import { useState } from 'react'

import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { VideoDialog } from './VideoDialog'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

export function DashboardContent() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const { data: session } = useSession()
  const paciente = useQuery(api.paciente.getByEmailInicial, {
    email: session?.user?.email || '',
  })
  console.log(paciente)

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl)
    setIsVideoOpen(true)
  }

  if (!paciente) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum registro encontrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Não encontramos nenhum registro de paciente com seu email.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ScrollArea className="h-[calc(100vh-80px)] w-full overflow-x-auto">
        <Card>
          <CardHeader>
            <CardTitle>Sua ficha:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Nome:</strong> {paciente.nome}
              </p>

              <p>
                <strong>Última avaliação:</strong>{' '}
                {new Date(paciente._creationTime).toLocaleDateString() ||
                  'Nenhuma'}
              </p>

              {paciente.exercises && paciente.exercises.length > 0 && (
                <Collapsible className="mt-4">
                  <CollapsibleTrigger className="flex items-center gap-2">
                    <strong>Exercícios</strong>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 space-y-2">
                      {paciente.exercises.map((exercise, index) => (
                        <div key={index}>
                          {exercise.exerciseDetails && (
                            <div className="p-2 bg-secondary rounded-md">
                              <p>
                                <strong>Nome:</strong>{' '}
                                {exercise.exerciseDetails.nome}
                              </p>
                              <p>
                                <strong>Descrição:</strong>{' '}
                                {exercise.exerciseDetails.descricao}
                              </p>
                              {exercise.exerciseDetails.url_video && (
                                <Button
                                  variant="ghost"
                                  onClick={() =>
                                    exercise.exerciseDetails?.url_video &&
                                    handleVideoClick(
                                      exercise.exerciseDetails.url_video,
                                    )
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <PlayCircle className="h-4 w-4" />
                                  Ver vídeo do exercício
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </CardContent>
        </Card>
        <VideoDialog
          isOpen={isVideoOpen}
          onOpenChange={setIsVideoOpen}
          videoUrl={selectedVideo}
        />{' '}
      </ScrollArea>
    </div>
  )
}
