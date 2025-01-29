import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Avaliações Físicas | DoctorExe',
  description: 'Avaliações físicas do paciente',
}

export default function AvaliacoesPage(/* { params }: { params: { id: string } } */) {
  const avaliacoes = [
    {
      id: '1',
      data: new Date().toISOString(),
      tipo: 'Avaliação Inicial',
      status: 'Concluída',
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
            Avaliações Físicas
          </h1>
        </div>
        <Link
          href={`/dashboard/pacientes/${/* params.id */ '1'}/avaliacoes/nova`}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Avaliação
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {avaliacoes.map((avaliacao) => (
          <Card key={avaliacao.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{avaliacao.tipo}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Status: {avaliacao.status}
                </span>
                <Link
                  href={`/dashboard/pacientes/${/* params.id */ '1'}/avaliacoes/${avaliacao.id}`}
                >
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
