import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { EvolucaoTimeline } from '../../components/evolucao-timeline'

export const metadata: Metadata = {
  title: 'Evolução do Paciente | DoctorExe',
  description: 'Acompanhamento da evolução do paciente',
}

export default function EvolucaoPage(/* { params }: { params: { id: string } } */) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/pacientes/${/* params.id */ '1'}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Evolução do Paciente
          </h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>

      <Card className="p-6">
        <EvolucaoTimeline pacienteId={/* params.id */ '1'} />
      </Card>
    </div>
  )
}
