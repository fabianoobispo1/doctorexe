import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'
import { FaleConoscoList } from '@/components/FaleConoscoList'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const breadcrumbItems = [
  { title: 'Fale Conosco', link: '/dashboard/fale-conosco' },
]
export default function page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex-1 space-y-4 p-4 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <div className=" flex items-start justify-between gap-4">
          <Heading
            title={'Fale Conosco'}
            description={
              'Sera listado aqui o que foi enviado pelos usuarios na pagina de fale conosco'
            }
          />
        </div>
        <FaleConoscoList />
      </div>
    </ProtectedRoute>
  )
}
