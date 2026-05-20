'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'

import type { ActionsResponse } from '../utils/get-actions-error'

const signInSchema = z.object({
  email: z.email('Please provide a valid email address'),
  password: z.string('Please provide a password').min(6),
})

export async function signInWithEmailAndPassword(
  data: FormData,
): Promise<ActionsResponse> {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))

    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    ;(await cookies()).set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
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

  redirect('/auth/sign-in')
}
