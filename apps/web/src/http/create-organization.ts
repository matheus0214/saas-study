import { api } from './api-client'

type CreateOrganizationRequest = {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest): Promise<void> {
  await api.post('organizations', {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
