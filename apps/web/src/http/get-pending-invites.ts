import type { Role } from '@saas/auth'

import { api } from './api-client'

type GetPendingInvitesResponse = {
  invites: {
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
    organization: {
      name: string | null
    } | null
  }[]
}

export async function getPendingInvites(): Promise<GetPendingInvitesResponse> {
  const result = await api
    .get<GetPendingInvitesResponse>('pending-invites')
    .json()

  return result
}
