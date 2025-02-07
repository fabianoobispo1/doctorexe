import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Detalhes da Avaliação | DoctorExe',
  description: 'Visualização detalhada da avaliação física',
}

export default function AvaliacaoDetalhesPage(/* {
  params,
}: {
  params: { id: string; avaliacaoId: string }
} */) {
  const avaliacao = {
    /*   id: params.avaliacaoId, */
    id: '1',
    dataAvaliacao: new Date().toISOString(),
    nome: 'João Silva',
    dataNascimento: '1990-01-01',
    altura: 1.75,
    peso: 70,
    pressaoArterial: '120/80',
    frequenciaCardiaca: 75,
    historiaClinica: 'História clínica detalhada do paciente...',
    apresentacaoPaciente: {
      deambulando: true,
      deambulandoComApoio: false,
      cadeiraRodas: false,
      internado: false,
      orientado: true,
    },
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/pacientes/${'1'}/avaliacoes`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Avaliação Física
          </h1>
        </div>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Dados Básicos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Data da Avaliação</p>
              <p className="text-sm text-muted-foreground">
                {new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Nome do Paciente</p>
              <p className="text-sm text-muted-foreground">{avaliacao.nome}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Altura</p>
              <p className="text-sm text-muted-foreground">
                {avaliacao.altura}m
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Peso</p>
              <p className="text-sm text-muted-foreground">
                {avaliacao.peso}kg
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Pressão Arterial</p>
              <p className="text-sm text-muted-foreground">
                {avaliacao.pressaoArterial}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Frequência Cardíaca</p>
              <p className="text-sm text-muted-foreground">
                {avaliacao.frequenciaCardiaca} bpm
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        <Card>
          <CardHeader>
            <CardTitle>Apresentação do Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Object.entries(avaliacao.apresentacaoPaciente).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        value ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        <Card>
          <CardHeader>
            <CardTitle>História Clínica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {avaliacao.historiaClinica}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
