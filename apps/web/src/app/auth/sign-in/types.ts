export type SignInResponse = {
  success: boolean
  message: string | null
  errors: { field: string; message: string }[] | null
}
