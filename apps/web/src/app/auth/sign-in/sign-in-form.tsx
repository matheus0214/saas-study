'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import githubIcon from '@/assets/github-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { signInWithEmailAndPassword } from './actions'
import type { SignInResponse } from './types'

type ErrorsValidation = SignInResponse['errors']

function getErrorMessage(field: string, errors: ErrorsValidation) {
  const error = errors?.find((e) => e.field?.includes(field))
  return error?.message
}

export function SignInForm() {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sigin failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" />

        {getErrorMessage('email', errors) && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {getErrorMessage('email', errors)}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />

        <Link
          href="/auth/forgot-password"
          className="text-foreground text-xs font-medium hover:underline"
        >
          Forgot your password?
        </Link>

        {getErrorMessage('password', errors) && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {getErrorMessage('password', errors)}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Sign in with Email'
        )}
      </Button>

      <Button
        className="w-full"
        variant="link"
        size="sm"
        nativeButton={false}
        render={<Link href="/auth/sign-up" />}
      >
        Don't have an account? Sign up
      </Button>

      <Separator />

      <Button className="w-full" variant="outline" type="submit">
        <Image
          src={githubIcon}
          alt="Github"
          className="mr-2 size-4 dark:invert"
        />
        Sign in with Github
      </Button>
    </form>
  )
}
