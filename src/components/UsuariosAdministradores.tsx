'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { AxiosError } from 'axios'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/lib/axios'

import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { Spinner } from './ui/spinner'

interface User {
  id: string
  nome: string
  email: string
  role: 'user' | 'admin'
}

export function UsuariosAdministradores() {
  const [usuarios, setusuarios] = useState<User[]>([])
  const [carregou, setiscarregou] = useState(false)
  const [loadingUsuario, setLoadingUsuario] = useState<boolean>(false)
  const { data: session } = useSession()

  const loadUsuarios = useCallback(async () => {
    if (session) {
      try {
        const response = await api.get('/doctorexelistarusuarios', {
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
          },
        })

        const usuariosOrdenados = response.data.doctorExeUsuario.sort(
          (a: User, b: User) => a.nome.localeCompare(b.nome),
        )

        setusuarios(usuariosOrdenados)

        if (!response) {
          console.error('Erro ao buscar os dados do usuário:')
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error)
      }
    }
  }, [session])

  useEffect(() => {
    if (session) {
      if (!carregou) {
        loadUsuarios()
        setiscarregou(true)
      }
    }
  }, [loadUsuarios, session, carregou, setiscarregou])

  const toggleAdmin = async (id: string, role: string) => {
    setLoadingUsuario(true)
    const dataToSend = {
      docrotExeUsuario_id: id,
      role,
    }
    try {
      if (session) {
        const response = await api.post(
          'alterarusuarioadmindoctorexe',
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${session.user.apiToken}`,
            },
          },
        )
        console.log(response)
      }

      loadUsuarios()
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.message)
      } else {
        console.log('Erro Interno')
      }
    }

    loadUsuarios()
    setLoadingUsuario(false)
  }

  return (
    <div className="space-y-8">
      <ScrollArea className="h-[calc(80vh-220px)] w-full overflow-x-auto rounded-md border">
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="text-center">Nome</TableHead>
              <TableHead className="text-center">email</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {usuarios ? (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="text-center">
                    <Checkbox
                      disabled={loadingUsuario}
                      checked={usuario.role === 'admin'}
                      onCheckedChange={() =>
                        toggleAdmin(
                          usuario.id,
                          usuario.role === 'admin' ? 'user' : 'admin',
                        )
                      }
                    />
                  </TableCell>

                  <TableCell className="text-center">{usuario.nome}</TableCell>
                  <TableCell className="text-center">{usuario.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <Spinner />
            )}
          </TableBody>
        </Table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
