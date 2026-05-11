import { cn } from '@/lib/utils'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className={`${cn('dark')} flex min-h-screen flex-col items-center justify-center px-4`}
    >
      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}
