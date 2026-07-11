import { api } from './api-client'

type RevokeinviteRequest = {
  org: string
  inviteId: string
}

export async function revokeinvite({ inviteId, org }: RevokeinviteRequest) {
  await api.delete(`organizations/${org}/invites/${inviteId}`)
}
