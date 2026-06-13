import { Role } from '@saas/auth'

import { api } from './api-client'

type GetMembershipResponse = {
  membership: {
    id: string
    role: Role
    organizationId: string
    userId: string
  }
}

export async function getMembership(
  org: string,
): Promise<GetMembershipResponse> {
  const result = await api
    .get<GetMembershipResponse>(`organizations/${org}/membership`)
    .json()

  return result
}
