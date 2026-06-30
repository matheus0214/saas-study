import { getCurrentOrg } from '@/auth/auth'

import { NavLink } from './nav-link'
import { Button } from './ui/button'

export async function Tabs() {
  const org = await getCurrentOrg()!

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-300 items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border border border-transparent"
          render={<NavLink href={`/org/${org}`} />}
        >
          Projects
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border border border-transparent"
          render={<NavLink href={`/org/${org}/members`} />}
        >
          Members
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border border border-transparent"
          render={<NavLink href={`/org/${org}/settings`} />}
        >
          Settings & Billing
        </Button>
      </nav>
    </div>
  )
}
