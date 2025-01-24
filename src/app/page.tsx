import { Metadata } from 'next'

import Redirecionador from '@/components/redirecionador'

export const metadata: Metadata = {
  title: 'DoctorExe',
  description: 'Página inicial do DoctorExe',
  /*   keywords:
    '', */
}

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center ">
      <Redirecionador link={'/entrar'} />
    </div>
  )
}
