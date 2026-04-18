export type AppErrorCode = 'AUTH_ROLE_PERMISSIONS_NOT_FOUND'

type Constructor = abstract new (...args: never[]) => unknown

type AppErrorOptions = {
  code: AppErrorCode
  details?: Record<string, unknown>
  cause?: unknown
  isOperational?: boolean
}

export class AppError extends Error {
  public readonly code: AppErrorCode
  public readonly details?: Record<string, unknown>
  public readonly isOperational: boolean

  constructor(message: string, options: AppErrorOptions) {
    super(message)

    this.name = new.target.name
    this.code = options.code
    this.details = options.details
    this.isOperational = options.isOperational ?? true

    // Preserve original failure context for logging and diagnostics.
    if (options.cause !== undefined) {
      ;(this as AppError & { cause?: unknown }).cause = options.cause
    }

    Object.setPrototypeOf(this, new.target.prototype)

    const errorWithCapture = Error as ErrorConstructor & {
      captureStackTrace?: (target: object, constructor?: Constructor) => void
    }
    errorWithCapture.captureStackTrace?.(
      this,
      new.target as Constructor | undefined,
    )
  }
}

export class RolePermissionsNotFoundError extends AppError {
  constructor(role: string) {
    super(`Permissions for role ${role} not found.`, {
      code: 'AUTH_ROLE_PERMISSIONS_NOT_FOUND',
      details: { role },
    })
  }
}
