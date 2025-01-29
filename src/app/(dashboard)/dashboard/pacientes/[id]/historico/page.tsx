import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Histórico do Paciente | DoctorExe',
  description: 'Histórico médico do paciente',
}

export default function HistoricoPage(/* { params }: { params: { id: string } } */) {
  // Mock de dados - substituir pela chamada à API
  const historico = [
    {
      id: '1',
      data: new Date().toISOString(),
      descricao: 'Primeira consulta',
      tipo: 'Avaliação Inicial',
    },
  ]

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
            Histórico Médico
          </h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>

      <div className="space-y-4">
        {historico.map((registro) => (
          <Card key={registro.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{registro.tipo}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(registro.data).toLocaleDateString('pt-BR')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {registro.descricao}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
