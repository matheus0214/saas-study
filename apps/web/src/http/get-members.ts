import type { Role } from '@saas/auth'

import { api } from './api-client'

type GetMembersRequest = {
  members: {
    id: string
    userId: string
    role: Role
    name: string | null
    email: string
    avatarUrl: string | null
  }[]
}

export async function getMembers(org: string): Promise<GetMembersRequest> {
  const result = await api
    .get<GetMembersRequest>(`/org/${org}/members`, {
      next: {
        tags: [`${org}/members`],
      },
    })
    .json()

  return result
}
