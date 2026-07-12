import { Plus } from 'lucide-react'
import Link from 'next/link'

import { ability, getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'

import { ProjectList } from './project-list'

export default async function Projects() {
  const org = await getCurrentOrg()
  if (!org) {
    return
  }

  const permissions = await ability()

  const canCreateProject = permissions?.can('create', 'Project')
  const canListProjects = permissions?.can('get', 'Project')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        {canCreateProject && (
          <Button
            size="sm"
            render={<Link href={`/org/${org}/create-project`} />}
          >
            <Plus className="mr-2 size-4" />
            Create project
          </Button>
        )}
      </div>

      {canListProjects ? (
        <ProjectList />
      ) : (
        <p className="text-muted-foreground text-sm">
          Yout are not allowed to see organization projects
        </p>
      )}
    </div>
  )
}
