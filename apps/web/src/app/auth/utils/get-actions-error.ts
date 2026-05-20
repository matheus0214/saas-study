export type ActionsResponse = {
  success: boolean
  message: string | null
  errors: { field: string; message: string }[] | null
}

type ErrorsValidation = ActionsResponse['errors']

export function getErrorMessage(field: string, errors: ErrorsValidation) {
  const error = errors?.find((e) => e.field?.includes(field))
  return error?.message
}
