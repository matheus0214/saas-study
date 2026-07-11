import type { Role } from '@saas/auth'

import { api } from './api-client'

type GetInvitesResponse = {
  invites: {
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
    } | null
  }[]
}

export async function getInvites(org: string): Promise<GetInvitesResponse> {
  const result = await api
    .get<GetInvitesResponse>(`organizations/${org}/invites`, {
      next: {
        tags: [`${org}/invites`],
      },
    })
    .json()

  return result
}
