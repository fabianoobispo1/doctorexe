import { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { ExerciciosList } from './exercicios-list'

/* import { AvaliacaoForm } from '../../../components/avaliacao-form'
 */
export const metadata: Metadata = {
  title: 'Exercícios| DoctorExe',
  description: 'Cadastro de exercícios',
}

export default async function NovaAvaliacaoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/pacientes/${id}/exercicios`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Adicionar exercícios
        </h1>
      </div>
      <div className="rounded-md border p-4">
        <ExerciciosList pascienteId={id} />
      </div>
    </div>
  )
}
