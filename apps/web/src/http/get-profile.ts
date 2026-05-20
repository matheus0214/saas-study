import { api } from './api-client'

type GetProfileResponse = {
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export async function getProfile(): Promise<GetProfileResponse> {
  const result = await api.get<GetProfileResponse>('profile').json()

  return result
}
