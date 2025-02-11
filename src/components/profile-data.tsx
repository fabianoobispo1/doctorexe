'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { AxiosError } from 'axios'

import { Card } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { EmptyCard } from '@/components/empty-card'
import { Spinner } from '@/components/ui/spinner'

interface ProfileData {
  id: string
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  genero: string
}

export function ProfileData() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mensageError, setMensageError] = useState<string>(
    'Não foi possível carregar os dados do perfil',
  )
  const { data: session } = useSession()

  useEffect(() => {
    async function loadProfileData() {
      try {
        if (session) {
          const response = await api.post(
            '/doctorexe/perfil/email/dadosiniciais',
            {
              email: session?.user.email,
            },
            {
              headers: {
                Authorization: `Bearer ${session?.user.apiToken}`,
              },
            },
          )
          console.log(response.data)
          setProfileData(response.data)
        }
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error)
        if (error instanceof AxiosError) {
          setMensageError(error.response?.data.message)
        } else {
          setMensageError('Ocorreu um erro desconhecido')
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadProfileData()
  }, [session])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner />
      </div>
    )
  }

  if (!profileData) {
    return <EmptyCard title="Sem dados" description={mensageError} />
  }

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Ficha medica encontrada</h3>
      <div className="space-y-4">
        {/*   <div>
          <p className="text-sm text-muted-foreground">Nome</p>
          <p className="font-medium">{profileData.nome}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{profileData.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Telefone</p>
          <p className="font-medium">{profileData.telefone}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Data de Nascimento</p>
          <p className="font-medium">{profileData.dataNascimento}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Gênero</p>
          <p className="font-medium">{profileData.genero}</p>
        </div> */}
      </div>
    </Card>
  )
}
