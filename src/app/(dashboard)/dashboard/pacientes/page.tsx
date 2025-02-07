'use client'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ScrollArea } from '@/components/ui/scroll-area'
import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'
import { api } from '@/lib/axios'
import { Spinner } from '@/components/ui/spinner'

import { columns } from './components/columns'

interface PaginationMeta {
  page: number
  perPage: number
  total: number
}

const breadcrumbItems = [{ title: 'Pacientes', link: '/dashboard/pacientes' }]
export default function PacientesPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [pacientes, setPacientes] = useState([])
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    perPage: 20,
    total: 0,
  })

  const loadPacientes = useCallback(
    async (page: number = 1) => {
      if (session) {
        setLoading(true)
        const response = await api.get(`/doctorexe/pacientes?page=${page}`, {
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
          },
        })
        console.log(response)
        setPacientes(response.data.pacientes)
        setMeta(response.data.meta)
        setLoading(false)
      }
    },
    [session],
  )

  useEffect(() => {
    loadPacientes(1)
  }, [loadPacientes])

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <div className=" flex items-start justify-between gap-4">
          <Heading
            title={'Pacientes'}
            description={'Gerenciar os pacientes.'}
          />
          <Link href="/dashboard/pacientes/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <DataTable
            searchKey="nome"
            columns={columns}
            data={pacientes}
            pagination={{
              pageSize: meta.perPage,
              pageCount: Math.ceil(meta.total / meta.perPage),
              currentPage: meta.page,
              onPageChange: loadPacientes,
            }}
          />
        )}
      </div>
    </ScrollArea>
  )
}
