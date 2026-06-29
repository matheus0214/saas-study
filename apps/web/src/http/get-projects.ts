import { api } from './api-client'

type GetProjectsResponse = {
  projects: {
    description: string
    id: string
    name: string
    slug: string
    ownerId: string
    avatarUrl: string | null
    organizationId: string
    createdAt: string
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  }[]
}

export async function getProjects(org: string): Promise<GetProjectsResponse> {
  const result = await api
    .get<GetProjectsResponse>(`organizations/${org}/projects`)
    .json()

  return result
}
