import { api } from './api-client'

type GetBillingResponse = {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

export async function getBilling(orgSlug: string): Promise<GetBillingResponse> {
  const result = await api
    .get<GetBillingResponse>(`organizations/${orgSlug}/billing`)
    .json()

  return result
}
