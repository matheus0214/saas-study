import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Get authenticated user profile',
        response: {
          200: z.object({
            user: z.object({
              id: z.uuid(),
              email: z.email(),
              name: z.string().nullable(),
              avatarUrl: z.url().nullable(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const payload = await request.jwtVerify<{ sub: string }>()

      if (!payload.sub) {
        return reply.status(404).send({ message: 'User not found.' })
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
      })

      if (!user) {
        throw new BadRequestError('User not found.')
      }

      return reply.status(200).send({ user })
    },
  )
}
