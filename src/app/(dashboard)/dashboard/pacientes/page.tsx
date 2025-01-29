import { Metadata } from 'next'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ScrollArea } from '@/components/ui/scroll-area'
import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'

import { columns } from './components/columns'

export const metadata: Metadata = {
  title: 'Pacientes | DoctorExe',
  description: 'Gestão de Pacientes',
}

const mockPacientes = [
  {
    id: '1',
    nome: 'João Silva',
    dataNascimento: '1990-01-01',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
    endereco: 'Rua Exemplo, 123',
    created_at: new Date().toISOString(),
  },
]

const breadcrumbItems = [{ title: 'Pacientes', link: '/dashboard/pacientes' }]
export default function PacientesPage() {
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
        <DataTable searchKey="nome" columns={columns} data={mockPacientes} />
      </div>
    </ScrollArea>
  )
}
