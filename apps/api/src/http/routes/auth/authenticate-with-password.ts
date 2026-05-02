import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate user with email and password',
        body: z.object({
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      const unanuthorizedErrorMessage = 'Invalid credentials.'

      if (!userFromEmail) {
        throw new UnauthorizedError(unanuthorizedErrorMessage)
      }

      if (userFromEmail.passwordHash === null) {
        throw new UnauthorizedError(
          'User does not have a password, use social login.',
        )
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash,
      )

      if (!isPasswordValid) {
        throw new UnauthorizedError(unanuthorizedErrorMessage)
      }

      const tokenPayload = {
        sub: userFromEmail.id,
      }

      const token = await reply.jwtSign(tokenPayload, {
        sign: {
          expiresIn: '7d',
        },
      })

      return reply.status(201).send({ token })
    },
  )
}
