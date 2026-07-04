import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { shutdownOrganization } from '@/http/shutdown-organization'

async function shutdownOrganizationAction() {
  'use server'

  const currentOrg = await getCurrentOrg()

  if (currentOrg) {
    await shutdownOrganization(currentOrg)

    redirect('/')
  }
}

export function ShutdownOrganizationButton() {
  return (
    <form action={shutdownOrganizationAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="mr-2 size-4" />
        Shutdown organization
      </Button>
    </form>
  )
}
