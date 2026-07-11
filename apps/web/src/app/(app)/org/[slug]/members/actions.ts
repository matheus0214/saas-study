'use server'

import { revalidateTag } from 'next/cache'

import { getCurrentOrg } from '@/auth/auth'
import { removeMember } from '@/http/remove-member'

export async function removeMemberAction(memberId: string) {
  const org = await getCurrentOrg()
  if (!org) {
    return
  }

  await removeMember({ memberId, org })

  revalidateTag(`${org}/members`)
}
