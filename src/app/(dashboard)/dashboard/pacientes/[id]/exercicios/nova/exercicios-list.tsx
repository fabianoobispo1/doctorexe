'use client'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { extractYouTubeID } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ExerciciosListProps {
  pascienteId: string
}

export const ExerciciosList = ({ pascienteId }: ExerciciosListProps) => {
  const [loading, setLoading] = useState(true)
  const [selectedExercises, setSelectedExercises] = useState<Id<'exercise'>[]>(
    [],
  )
  const [initialExercises, setInitialExercises] = useState<Id<'exercise'>[]>([])

  const exercises = useQuery(api.exercicio.getAll)
  const patientExercises = useQuery(api.exercicio.getByPatientId, {
    pascienteId: pascienteId as Id<'paciente'>,
  })

  const addExerciseToPatient = useMutation(api.exercicio.addToPatient)
  const removeExerciseFromPatient = useMutation(api.exercicio.removeFromPatient)

  useEffect(() => {
    if (patientExercises) {
      const existingExerciseIds = patientExercises.map((ex) => ex.exercise_id)
      setInitialExercises(existingExerciseIds)
      setSelectedExercises(existingExerciseIds)
      setLoading(false)
    }
  }, [patientExercises])

  const handleCheckboxChange = (exerciseId: Id<'exercise'>) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    )
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const exercisesToAdd = selectedExercises.filter(
        (id) => !initialExercises.includes(id),
      )

      const exercisesToRemove = initialExercises.filter(
        (id) => !selectedExercises.includes(id),
      )

      for (const exerciseId of exercisesToAdd) {
        await addExerciseToPatient({
          patientId: pascienteId as Id<'paciente'>,
          exerciseId,
          created_at: Date.now(),
          updated_at: Date.now(),
        })
      }

      for (const exerciseId of exercisesToRemove) {
        await removeExerciseFromPatient({
          patientId: pascienteId as Id<'paciente'>,
          exerciseId,
        })
      }

      setInitialExercises([...selectedExercises])
    } catch (error) {
      console.error('Erro ao salvar exercícios:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {loading ? <Spinner /> : null}
        <ScrollArea className="h-[calc(100vh-220px)]  w-full pr-4">
          {' '}
          {exercises?.map((exercise) => (
            <div
              key={exercise._id}
              className="flex items-center space-x-2 border p-4 rounded-md"
            >
              <Checkbox
                checked={selectedExercises.includes(exercise._id)}
                onCheckedChange={() => handleCheckboxChange(exercise._id)}
              />
              <div>
                <h3 className="font-medium">{exercise.nome}</h3>
                <p className="text-sm text-gray-500">{exercise.descricao}</p>

                <div className="w-40 aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${extractYouTubeID(exercise.url_video)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      <Button onClick={handleSave} className="w-full">
        Salvar Exercícios Selecionados
      </Button>
    </div>
  )
}
