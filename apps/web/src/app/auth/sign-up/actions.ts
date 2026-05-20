'use server'

import { HTTPError } from 'ky'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      error: 'Please, enter your full name',
    }),
    email: z.email('Please provide a valid email address'),
    password: z
      .string('Please provide a password')
      .min(6, 'Password should have at least 6 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    error: 'Password confirmation does not match',
    path: ['password_confirmation'],
  })

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))

    return { success: false, message: null, errors }
  }

  const { name, email, password } = result.data

  try {
    await signUp({
      name,
      email,
      password,
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

  redirect('/')
}
