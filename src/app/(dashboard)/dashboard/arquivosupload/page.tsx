import BreadCrumb from '@/components/breadcrumb'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Heading } from '@/components/ui/heading'
/* import { TodoList } from '@/components/TodoList' */

const breadcrumbItems = [
  { title: 'Adicionar arquivos', link: '/dashboard/arquivosupload' },
]
export default function page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex-1 space-y-4 p-4 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <div className=" flex items-start justify-between gap-4">
          <Heading
            title={'Adicionar arquivos'}
            description={'Aqui você pode adicionar arquivos para os pacientea.'}
          />
        </div>
        {/*       <TodoList /> */}
      </div>
    </ProtectedRoute>
  )
}
