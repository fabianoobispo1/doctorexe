'use client'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'convex/react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/convex/_generated/api'

import { columns } from './components/columns'

const breadcrumbItems = [{ title: 'Pacientes', link: '/dashboard/pacientes' }]
export default function PacientesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 20
  const offset = (currentPage - 1) * perPage

  const rawPacientes = useQuery(api.paciente.getAllPaginated, {
    offset,
    limit: perPage,
  })

  const total = useQuery(api.paciente.getCount)
  // Transform Convex data to match Paciente interface
  const pacientes =
    rawPacientes?.map((p) => ({
      id: p._id,
      nome: p.nome,
      dataNascimento: new Date(p.dataNascimento).toISOString(),
      telefone: p.telefone,
      email: p.email,
      sexo: p.sexo,
      cidade: p.cidade,
      bairro: p.bairro,
      empresa: p.empresa,
      endereco: p.enderecoResidencial,
      enderecoResidencial: p.enderecoResidencial,
      enderecoComercial: p.enderecoComercial,
      naturalidade: p.naturalidade,
      estadoCivil: p.estadoCivil,
      created_at: new Date(p.created_at).toISOString(),
      avaliacoes: p.avaliacoes,
      exercicios: p.exercicios,
    })) || []

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (pacientes === undefined || total === undefined) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 ">
      <BreadCrumb items={breadcrumbItems} />
      <div className=" flex items-start justify-between gap-4">
        <Heading title={'Pacientes'} description={'Gerenciar os pacientes.'} />
        <Link href="/dashboard/pacientes/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        </Link>
      </div>

      <DataTable
        searchKey="nome"
        columns={columns}
        data={pacientes}
        pagination={{
          pageSize: perPage,
          pageCount: Math.ceil((total || 0) / perPage),
          currentPage,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  )
}
