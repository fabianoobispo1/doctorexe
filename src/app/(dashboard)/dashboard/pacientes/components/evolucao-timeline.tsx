'use client'

import { Card } from '@/components/ui/card'

interface EvolucaoTimelineProps {
  pacienteId: string
}

export function EvolucaoTimeline({ pacienteId }: EvolucaoTimelineProps) {
  // Mock de dados - substituir pela chamada à API
  const evolucoes = [
    {
      id: pacienteId,
      data: new Date().toISOString(),
      descricao: 'Paciente apresentou melhora significativa',
      tipo: 'Fisioterapia',
    },
  ]

  return (
    <div className="space-y-8">
      {evolucoes.map((evolucao, index) => (
        <div key={evolucao.id} className="relative">
          {index !== evolucoes.length - 1 && (
            <div className="absolute left-4 top-8 h-full w-0.5 bg-muted" />
          )}
          <Card className="relative ml-8 p-4">
            <div className="absolute -left-10 top-4 h-4 w-4 rounded-full bg-primary" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{evolucao.tipo}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(evolucao.data).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {evolucao.descricao}
              </p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
