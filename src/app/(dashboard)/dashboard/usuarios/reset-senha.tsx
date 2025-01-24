'use client'
import { useMutation, useQuery } from 'convex/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { api } from '@/convex/_generated/api'
import { useToast } from '@/hooks/use-toast'
import type { Id } from '@/convex/_generated/dataModel'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ResetSenha() {
  const { data: session } = useSession()
  const [carregou, setiscarregou] = useState(false)
  const router = useRouter()
  if (session) {
    if (!carregou) {
      console.log(session.user.nome)
      if (session.user.email === 'fbc623@gmail.com') {
        console.log('ok')
      } else {
        router.push('https://www.jfimperadores.com.br/dashboard')
      }
      setiscarregou(true)
    }
  }

  const users = useQuery(api.user.listCredentialsUsers)
  const resetPassword = useMutation(api.user.resetPassword)
  const { toast } = useToast()

  const handleResetPassword = async (userId: Id<'user'>) => {
    try {
      await resetPassword({ userId })
      toast({
        title: 'Senha resetada com sucesso',
        description: 'Nova senha: 12345678',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao resetar senha',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="rounded-md border">
      <ScrollArea className="h-[calc(80vh-220px)] w-full  rounded-md border   pr-2 ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleResetPassword(user._id)}
                    variant="outline"
                    size="sm"
                  >
                    Resetar Senha
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
