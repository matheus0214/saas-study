import { ability, getCurrentOrg } from '@/auth/auth'

import { NavLink } from './nav-link'
import { Button } from './ui/button'

export async function Tabs() {
  const org = await getCurrentOrg()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canGetMembers = permissions?.can('get', 'User')
  const canGetProjects = permissions?.can('get', 'Project')

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-300 items-center gap-2">
        {canGetProjects && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border border border-transparent"
            render={<NavLink href={`/org/${org}`} />}
          >
            Projects
          </Button>
        )}
        {canGetMembers && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border border border-transparent"
            render={<NavLink href={`/org/${org}/members`} />}
          >
            Members
          </Button>
        )}
        {(canGetBilling || canUpdateOrganization) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border border border-transparent"
            render={<NavLink href={`/org/${org}/settings`} />}
          >
            Settings & Billing
          </Button>
        )}
      </nav>
    </div>
  )
}
