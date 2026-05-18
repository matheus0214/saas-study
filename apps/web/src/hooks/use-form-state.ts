import { useState, useTransition } from 'react'

type FormState = {
  success: boolean
  message: string | null
  errors: { field: string; message: string }[] | null
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  initialState?: FormState,
) {
  const [formState, setFormState] = useState<FormState>(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    },
  )

  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget

    const data = new FormData(form)

    startTransition(async () => {
      const result = await action(data)

      setFormState(result)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
