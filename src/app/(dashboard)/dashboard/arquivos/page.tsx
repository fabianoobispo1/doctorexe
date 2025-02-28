import { ArquivosUsuario } from '@/components/arquivos-usuario'
import BreadCrumb from '@/components/breadcrumb'
import { Heading } from '@/components/ui/heading'

const breadcrumbItems = [
  { title: 'Seus arquivos', link: '/dashboard/arquivos' },
]
export default function page() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 ">
      <BreadCrumb items={breadcrumbItems} />
      <div className=" flex items-start justify-between gap-4">
        <Heading
          title={'Seus arquivos'}
          description={'Esse e seus arquivos.'}
        />
      </div>
      <ArquivosUsuario />
    </div>
  )
}
