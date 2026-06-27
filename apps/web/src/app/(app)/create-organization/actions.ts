'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { createOrganization } from '@/http/create-organization'

const organizationSchema = z
  .object({
    name: z.string().min(4, 'Please include at least 4 characters.'),
    domain: z
      .string()
      .nullable()
      .refine((val) => {
        if (val) {
          const domainRegexp =
            /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/

          return domainRegexp.test(val)
        }

        return true
      }, 'Please enter a valid domain.'),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((val) => val === true || val === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain && !data.domain) {
        return false
      }

      return true
    },
    {
      error: 'Domain is required when auto join is enabled.',
      path: ['domain'],
    },
  )

export async function createOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))

    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
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
    message: 'Successfully saved the organization.',
    errors: null,
  }
}
