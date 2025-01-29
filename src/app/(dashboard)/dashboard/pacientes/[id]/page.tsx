import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Detalhes do Paciente | DoctorExe',
  description: 'Visualização detalhada do paciente',
}

export default function PacienteDetalhesPage(/* {
  params,
}: {
  params: { id: string }
} */) {
  // Mock de dados - substituir pela chamada à API
  const paciente = {
    id: /* params.id */ '1',
    nome: 'João Silva',
    dataNascimento: '1990-01-01',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
    endereco: 'Rua Exemplo, 123',
    created_at: new Date().toISOString(),
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pacientes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Detalhes do Paciente
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">{paciente.nome}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Data de Nascimento</p>
              <p className="text-sm text-muted-foreground">
                {new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Telefone</p>
              <p className="text-sm text-muted-foreground">
                {paciente.telefone}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{paciente.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Endereço</p>
              <p className="text-sm text-muted-foreground">
                {paciente.endereco}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href={`/dashboard/pacientes/${paciente.id}/avaliacoes`}>
              <Button className="w-full">Nova Avaliação</Button>
            </Link>
            <Link href={`/dashboard/pacientes/${paciente.id}/historico`}>
              <Button variant="outline" className="w-full">
                Ver Histórico
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
