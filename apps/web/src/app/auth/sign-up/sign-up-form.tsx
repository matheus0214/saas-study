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

import { sigInWithGithub } from '../actions'
import { getErrorMessage } from '../utils/get-actions-error'
import { signUpAction } from './actions'

export function SignUpForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(signUpAction)

  return (
    <div className="space-y-4">
      <form action="" onSubmit={handleSubmit} className="space-y-4">
        {!success && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sigup failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="text" id="name" />
          {getErrorMessage('name', errors) && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getErrorMessage('name', errors)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" id="email" />
          {getErrorMessage('email', errors) && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getErrorMessage('email', errors)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password" />
          {getErrorMessage('password', errors) && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getErrorMessage('password', errors)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            name="password_confirmation"
            type="password"
            id="password_confirmation"
          />
          {getErrorMessage('password_confirmation', errors) && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getErrorMessage('password_confirmation', errors)}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>

        <Button
          className="w-full"
          variant="link"
          size="sm"
          nativeButton={false}
          render={<Link href="/auth/sign-in" />}
        >
          Already registed? Sign in
        </Button>
      </form>

      <Separator />
      <form action={sigInWithGithub}>
        <Button className="w-full" variant="outline" type="submit">
          <Image
            src={githubIcon}
            alt="Github"
            className="mr-2 size-4 dark:invert"
          />
          Sign up with Github
        </Button>
      </form>
    </div>
  )
}
