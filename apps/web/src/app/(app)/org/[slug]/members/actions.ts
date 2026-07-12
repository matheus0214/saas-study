'use server'

import { type Role, roleSchema } from '@saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createInvite } from '@/http/create-invite'
import { removeMember } from '@/http/remove-member'
import { revokeinvite } from '@/http/revoke-invite'
import { updateMember } from '@/http/update-member'

export async function removeMemberAction(memberId: string) {
  const org = await getCurrentOrg()
  if (!org) {
    return
  }

  await removeMember({ memberId, org })

  revalidateTag(`${org}/members`)
}

export async function updateMemberAction(memberId: string, role: Role) {
  const org = await getCurrentOrg()
  if (!org) {
    return
  }

  await updateMember({ memberId, org, role })

  revalidateTag(`${org}/members`)
}

export async function removeInviteAction(inviteId: string) {
  const org = await getCurrentOrg()
  if (!org) {
    return
  }

  await revokeinvite({ inviteId, org })

  revalidateTag(`${org}/invites`)
}

const inviteSchema = z.object({
  email: z.email('Invalid e-mail address.'),
  role: roleSchema,
})

export async function createInviteAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))

    return { success: false, message: null, errors }
  }

  const { email, role } = result.data

  const org = await getCurrentOrg()
  if (!org) {
    return {
      success: false,
      message: 'Unable to find organization',
      errors: null,
    }
  }

  try {
    await createInvite({
      email,
      role,
      org,
    })

    revalidateTag(`${org}/invites`)
  } catch (error) {
    console.error(error)

    if (error instanceof HTTPError) {
      const { message } = error.data

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'An unexpected error occurred, try again later',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully created the invite.',
    errors: null,
  }
}
