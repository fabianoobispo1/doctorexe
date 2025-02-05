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

import { columns } from './components/columns'

interface PaginationMeta {
  page: number
  perPage: number
  total: number
}

const breadcrumbItems = [{ title: 'Exercicios', link: '/dashboard/exercicios' }]
export default function ExerciciosPage() {
  const { data: session } = useSession()
  const [exercicios, setExercicios] = useState([])
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    perPage: 20,
    total: 0,
  })

  const loadExercicios = useCallback(
    async (page: number = 1) => {
      if (session) {
        const response = await api.get(`/doctorexe/exercicios?page=${page}`, {
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
          },
        })
        console.log(response)
        setExercicios(response.data.exercicios)
        setMeta(response.data.meta)
      }
    },
    [session],
  )

  useEffect(() => {
    loadExercicios(1)
  }, [loadExercicios])

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <div className=" flex items-start justify-between gap-4">
          <Heading
            title={'Exercicios'}
            description={'Gerenciar os exercicios.'}
          />
          <Link href="/dashboard/exercicios/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Exercicio
            </Button>
          </Link>
        </div>
        <DataTable
          searchKey="nome"
          columns={columns}
          data={exercicios}
          pagination={{
            pageSize: meta.perPage,
            pageCount: Math.ceil(meta.total / meta.perPage),
            currentPage: meta.page,
            onPageChange: loadExercicios,
          }}
        />
      </div>
    </ScrollArea>
  )
}
