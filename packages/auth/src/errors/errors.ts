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

/**
 * EXEMPLOS DE USO DO `cause`:
 *
 * 1. Capturar erro de validação (ex: Zod)
 * ─────────────────────────────────────────
 * try {
 *   const schema = z.object({ email: z.string().email() })
 *   schema.parse(data)
 * } catch (err) {
 *   throw new ValidationError('Invalid user data', {
 *     email: data.email,
 *     cause: err, // Preserve erro original do Zod
 *   })
 * }
 *
 * 2. Capturar erro de banco de dados
 * ──────────────────────────────────
 * try {
 *   await db.users.findUnique({ where: { id: userId } })
 * } catch (err) {
 *   throw new AppError('Failed to fetch user', {
 *     code: 'AUTH_DB_ERROR',
 *     statusCode: 500,
 *     details: { userId },
 *     cause: err, // Stack trace e mensagem do Postgres/Prisma preservados
 *   })
 * }
 *
 * 3. Usar em logger/handler central
 * ─────────────────────────────────
 * function logError(error: unknown) {
 *   if (error instanceof AppError) {
 *     console.error({
 *       message: error.message,
 *       code: error.code,
 *       statusCode: error.statusCode,
 *       details: error.details,
 *       stack: error.stack,
 *       // Stack trace do erro original para diagnóstico real:
 *       originalError: error.cause instanceof Error
 *         ? { message: error.cause.message, stack: error.cause.stack }
 *         : error.cause,
 *     })
 *   }
 * }
 */
