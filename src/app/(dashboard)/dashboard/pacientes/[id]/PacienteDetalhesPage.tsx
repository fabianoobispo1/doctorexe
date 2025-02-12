'use client'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { Spinner } from '@/components/ui/spinner'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface PacienteDetalhesPageProps {
  idPaciente: string
}
export interface Paciente {
  id: string
  nome: string
  dataNascimento: string
  sexo: string
  estadoCivil: string
  naturalidade: string
  empresa: string
  telefone: string
  enderecoResidencial: string
  enderecoComercial: string
  bairro: string
  cidade: string
  created_at: string
}

export default function PacienteDetalhesPage({
  idPaciente,
}: PacienteDetalhesPageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [paciente, setPaciente] = useState<Paciente | null>(null)

  const loadPaciente = useCallback(
    async (id: string) => {
      if (session) {
        const response = await api.get(`/doctorexe/pacientes/${id}`, {
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
          },
        })
        setPaciente(response.data.paciente)
      }
    },
    [session],
  )

  useEffect(() => {
    loadPaciente(idPaciente)
  }, [loadPaciente, idPaciente])

  const handleDeletePaciente = async () => {
    if (session) {
      await api.delete(`/doctorexe/pacientes/${idPaciente}`, {
        headers: {
          Authorization: `Bearer ${session.user.apiToken}`,
        },
      })
      router.push('/dashboard/pacientes')
    }
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
      {!paciente ? (
        <Spinner />
      ) : (
        <ScrollArea className="h-[calc(100vh-170px)]  w-full pr-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Nome</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.nome}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Empresa</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.empresa}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data de Nascimento</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(paciente.dataNascimento).toLocaleDateString(
                      'pt-BR',
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.sexo}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.telefone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estado Civil</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.estadoCivil}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Endereço</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.enderecoResidencial}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Bairro</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.bairro}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cidade</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.cidade}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Link href={`/dashboard/pacientes/${paciente.id}/exercicios`}>
                  <Button className="w-full">Exercícios</Button>
                </Link>
                <Link href={`/dashboard/pacientes/${paciente.id}/avaliacoes`}>
                  <Button className="w-full">Nova Avaliação</Button>
                </Link>
                <Link href={`/dashboard/pacientes/${paciente.id}/historico`}>
                  <Button variant="outline" className="w-full">
                    Ver Histórico
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Remover ficha
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso removerá
                        permanentemente a ficha do paciente {paciente.nome} e
                        todos os dados associados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePaciente}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  )
}
