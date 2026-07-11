import type { Role } from '@saas/auth'

import { api } from './api-client'

type UpdateMemberRequest = {
  org: string
  memberId: string
  role: Role
}

export async function updateMember({
  memberId,
  org,
  role,
}: UpdateMemberRequest) {
  await api.put(`organizations/${org}/members/${memberId}`, {
    json: { role },
  })
}
