'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createProject } from '@/http/create-project'

const projectSchema = z.object({
  name: z.string().min(4, 'Please include at least 4 characters.'),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))

    return { success: false, message: null, errors }
  }

  const { name, description } = result.data

  const org = await getCurrentOrg()
  if (!org) {
    return {
      success: false,
      message: 'Unable to find organization',
      errors: null,
    }
  }

  try {
    await createProject({
      name,
      description,
      org,
    })
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
    message: 'Successfully saved the project.',
    errors: null,
  }
}
