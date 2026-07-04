import { api } from './api-client'

type GetOrganizationResponse = {
  organization: {
    slug: string
    id: string
    name: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
    ownerId: string
  }
}

export async function getOrganization(
  orgSlug: string,
): Promise<GetOrganizationResponse> {
  const result = await api
    .get<GetOrganizationResponse>(`organizations/${orgSlug}`)
    .json()

  return result
}
