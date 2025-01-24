import BreadCrumb from '@/components/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heading } from '@/components/ui/heading'

import { ResetSenha } from '../usuarios/reset-senha'

const breadcrumbItems = [
  { title: 'Reset seenha', link: '/dashboard/resetsenha' },
]
export default function page() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <div className=" flex items-start justify-between gap-4">
          <Heading
            title={'Reset senha'}
            description={'Tela para resetar senha dos usuários'}
          />
        </div>
        <ResetSenha />
      </div>
    </ScrollArea>
  )
}
