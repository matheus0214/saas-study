'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { getErrorMessage } from '@/app/auth/utils/get-actions-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from '@/hooks/use-form-state'

import { createProjectAction } from './actions'

export function ProjectForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createProjectAction)

  return (
    <form action="" onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project failed!</AlertTitle>
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
        <Label htmlFor="name">Project name</Label>
        <Input name="name" type="text" id="name" />
        {getErrorMessage('name', errors) && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {getErrorMessage('name', errors)}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Project name</Label>
        <Textarea name="description" id="description" />
        {getErrorMessage('description', errors) && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {getErrorMessage('description', errors)}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save project'
        )}
      </Button>
    </form>
  )
}
