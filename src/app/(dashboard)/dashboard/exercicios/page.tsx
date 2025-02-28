'use client'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'convex/react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'
import { api } from '@/convex/_generated/api'
import { Spinner } from '@/components/ui/spinner'
import type { ExercicioProps } from '@/types'
import { ProtectedRoute } from '@/components/ProtectedRoute'

import { columns } from './components/columns'

const breadcrumbItems = [{ title: 'Exercicios', link: '/dashboard/exercicios' }]
export default function ExerciciosPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 20
  const offset = (currentPage - 1) * perPage

  const rawExercicios = useQuery(api.exercicio.getAllPaginated, {
    offset,
    limit: perPage,
  })

  const total = useQuery(api.exercicio.getCount, {})

  // Transform Convex data to match Paciente interface
  const exercicio =
    rawExercicios?.map((p) => ({
      id: p._id,
      nome: p.nome,
      descricao: p.descricao,
      url_img: p.url_img,
      url_video: p.url_video,
      created_at: Date.now(),
    })) || []

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (exercicio === undefined || total === undefined) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
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
        <DataTable<ExercicioProps, unknown>
          searchKey="nome"
          columns={columns}
          data={exercicio}
          pagination={{
            pageSize: perPage,
            pageCount: Math.ceil((total || 0) / perPage),
            currentPage,
            onPageChange: handlePageChange,
          }}
        />
      </div>
    </ProtectedRoute>
  )
}
