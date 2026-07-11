import { api } from './api-client'

type RemoveMemberRequest = {
  org: string
  memberId: string
}

export async function removeMember({ memberId, org }: RemoveMemberRequest) {
  await api.delete(`organizations/${org}/members/${memberId}`)
}
