import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import { cn } from '@/lib/utils'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (await isAuthenticated()) {
    redirect('/')
  }

  return (
    <div
      className={`${cn('dark')} flex min-h-screen flex-col items-center justify-center px-4`}
    >
      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}
