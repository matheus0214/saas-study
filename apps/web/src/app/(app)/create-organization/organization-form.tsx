'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { getErrorMessage } from '@/app/auth/utils/get-actions-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { createOrganizationAction } from './actions'

export function OrganizationForm() {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    createOrganizationAction,
  )

  return (
    <form action="" onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save organization failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Organization name</Label>
        <Input name="name" type="text" id="name" />
        {getErrorMessage('name', errors) && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {getErrorMessage('name', errors)}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input
          name="domain"
          type="text"
          id="domain"
          inputMode="url"
          placeholder="example.com"
        />
        {getErrorMessage('domain', errors) && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {getErrorMessage('domain', errors)}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <Checkbox
            name="shouldAttachUsersByDomain"
            id="shouldAttachUsersByDomain"
          />
          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span className="text-sm leading-none font-medium">
              Auto-join new members
            </span>
            <p className="text-muted-foreground text-sm">
              This will automatically invite all members with same e-mail domain
              to this organization.
            </p>
          </label>
        </div>
        {getErrorMessage('shouldAttachUsersByDomain', errors) && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {getErrorMessage('shouldAttachUsersByDomain', errors)}
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
          'Save organization'
        )}
      </Button>
    </form>
  )
}
