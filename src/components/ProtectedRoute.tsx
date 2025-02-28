'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Skeleton } from './ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/dashboard',
}) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    const userRole = session.user.role
    if (!allowedRoles.includes(userRole)) {
      router.push(redirectTo)
    }
  }, [session, status, router, allowedRoles, redirectTo])

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
        </div>
      </div>
    )
  }

  if (!session || !allowedRoles.includes(session.user.role)) {
    return null
  }

  return <>{children}</>
}
