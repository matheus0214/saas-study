import { api } from './api-client'

type CreateProjectRequest = {
  name: string
  description: string
  org: string
}

export async function createProject({
  name,
  description,
  org,
}: CreateProjectRequest): Promise<void> {
  await api.post(`/org/${org}/projects`, {
    json: {
      name,
      description,
    },
  })
}
