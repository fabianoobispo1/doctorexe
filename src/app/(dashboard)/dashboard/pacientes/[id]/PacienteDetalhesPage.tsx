'use client'

import Link from 'next/link'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { Id } from '@/convex/_generated/dataModel'

interface PacienteDetalhesPageProps {
  idPaciente: string
}

export default function PacienteDetalhesPage({
  idPaciente,
}: PacienteDetalhesPageProps) {
  const router = useRouter()
  const deletePaciente = useMutation(api.paciente.remove)

  const paciente = useQuery(api.paciente.getByID, {
    pacienteId: idPaciente as Id<'paciente'>,
  })

  const handleDeletePaciente = async () => {
    await deletePaciente({ pacienteId: idPaciente as Id<'paciente'> })
    router.push('/dashboard/pacientes')
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
              <CardHeader className="flex flex-row items-center gap-2">
                <CardTitle>Informações Pessoais</CardTitle>
                <Link href={`/dashboard/pacientes/${paciente._id}/editar`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Nome</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.nome}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">CPF</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.cpf}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {paciente.email}
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
                <Link href={`/dashboard/pacientes/${paciente._id}/exercicios`}>
                  <Button className="w-full">Exercícios</Button>
                </Link>
                <Link href={`/dashboard/pacientes/${paciente._id}/avaliacoes`}>
                  <Button className="w-full">Avaliações</Button>
                </Link>
                {/*    <Link href={`/dashboard/pacientes/${paciente._id}/historico`}>
                  <Button variant="outline" className="w-full">
                    Ver Histórico
                  </Button>
                </Link> */}

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
