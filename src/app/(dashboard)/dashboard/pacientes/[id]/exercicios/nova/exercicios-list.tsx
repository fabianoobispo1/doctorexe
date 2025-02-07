'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/lib/axios'
import { extractYouTubeID } from '@/lib/utils'

interface Exercise {
  id: string
  nome: string
  descricao: string
  url_video: string
}

interface ExerciciosListProps {
  pascienteId: string
}
/* /doctorexe/exercicios/all */
export const ExerciciosList = ({ pascienteId }: ExerciciosListProps) => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [initialExercises, setInitialExercises] = useState<string[]>([])

  useEffect(() => {
    const loadExercicios = async () => {
      try {
        if (session) {
          const response = await api.get('/doctorexe/exercicios/all', {
            headers: {
              Authorization: `Bearer ${session.user.apiToken}`,
            },
          })

          setExercises(response.data.exercicios)
          loadExerciciosPaciente()
        }
      } catch (error) {
        console.error('Erro ao carregar exercícios:', error)
      } finally {
        setLoading(false)
      }
    }

    const loadExerciciosPaciente = async () => {
      try {
        if (session) {
          const response = await api.get(
            `doctorexe/paciente/${pascienteId}/exercicios`,
            {
              headers: {
                Authorization: `Bearer ${session.user.apiToken}`,
              },
            },
          )
          const existingExerciseIds = response.data.exercises.map(
            (ex: Exercise) => ex.id,
          )

          setInitialExercises(existingExerciseIds)
          setSelectedExercises(existingExerciseIds)
        }
      } catch (error) {
        console.error('Erro ao carregar exercícios:', error)
      } finally {
        setLoading(false)
      }
    }

    loadExercicios()
  }, [session, pascienteId])

  const handleCheckboxChange = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    )
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      // Exercises to add (selected but not in initial)
      const exercisesToAdd = selectedExercises.filter(
        (id) => !initialExercises.includes(id),
      )

      // Exercises to remove (in initial but not selected)
      const exercisesToRemove = initialExercises.filter(
        (id) => !selectedExercises.includes(id),
      )
      // Add new exercises
      for (const exerciseId of exercisesToAdd) {
        if (session) {
          await api.post(
            '/doctorexe/paciente/exercicio',
            {
              patient_id: pascienteId,
              exercise_id: exerciseId,
            },
            {
              headers: {
                Authorization: `Bearer ${session?.user.apiToken}`,
              },
            },
          )
        }
      }

      // Remove unselected exercises
      for (const exerciseId of exercisesToRemove) {
        await api.delete('/doctorexe/paciente/exercicio/remove', {
          data: {
            patient_id: pascienteId,
            exercise_id: exerciseId,
          },
          headers: {
            Authorization: `Bearer ${session?.user.apiToken}`,
          },
        })
      }

      // Clear selection after successful save
      setInitialExercises([...selectedExercises])
    } catch (error) {
      console.error('Error saving exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {loading ? <Spinner /> : null}
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="flex items-center space-x-2 border p-4 rounded-md"
          >
            <Checkbox
              checked={selectedExercises.includes(exercise.id)}
              onCheckedChange={() => handleCheckboxChange(exercise.id)}
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
      </div>

      <Button onClick={handleSave} className="w-full">
        Salvar Exercícios Selecionados
      </Button>
    </div>
  )
}
