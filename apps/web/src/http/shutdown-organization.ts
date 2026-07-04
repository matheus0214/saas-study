import { api } from './api-client'

export async function shutdownOrganization(orgSlug: string) {
  await api.delete(`organizations/${orgSlug}`)
}
