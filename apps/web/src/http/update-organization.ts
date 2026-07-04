import { api } from './api-client'

type UpdateOrganizationRequest = {
  org: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

export async function updateOrganization({
  org,
  name,
  domain,
  shouldAttachUsersByDomain,
}: UpdateOrganizationRequest): Promise<void> {
  await api.put(`organizations/${org}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
