'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardContent() {
  const { data: session } = useSession()
  const paciente = useQuery(api.paciente.getByEmail, {
    email: session?.user?.email || '',
  })

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
      <Card>
        <CardHeader>
          <CardTitle>Suas Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Nome:</strong> {paciente.nome}
            </p>
            <p>
              <strong>Telefone:</strong> {paciente.telefone}
            </p>
            {/*    <p>
              <strong>Última avaliação:</strong>{' '}
              {paciente. || 'Nenhuma'}
            </p> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
