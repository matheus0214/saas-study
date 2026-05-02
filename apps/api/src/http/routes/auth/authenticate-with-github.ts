import { env } from '@saas/env'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate user with GitHub',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const githubOAuthURL = new URL(
        'https://github.com/login/oauth/access_token',
      )

      githubOAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
      githubOAuthURL.searchParams.set(
        'client_secret',
        env.GITHUB_OAUTH_CLIENT_SECRET,
      )

      githubOAuthURL.searchParams.set(
        'redirect_uri',
        env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
      )
      githubOAuthURL.searchParams.set('code', code)

      const githubAccessTokenResponse = await fetch(githubOAuthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccessTokenResponseData =
        await githubAccessTokenResponse.json()

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(githubAccessTokenResponseData)

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      })

      const githubUserData = await githubUserResponse.json()

      const {
        avatar_url: avatarUrl,
        email,
        id: githubId,
        name,
      } = z
        .object({
          id: z.number().transform(String),
          name: z.string().nullable(),
          email: z.email().nullable(),
          avatar_url: z.url(),
        })
        .parse(githubUserData)

      if (email === null) {
        throw new BadRequestError(
          'Your github account must have an email to authenticate.',
        )
      }

      let user = await prisma.user.findUnique({
        where: { email },
      })

      user ??= await prisma.user.create({
        data: {
          email,
          name,
          avatarUrl,
        },
      })

      const account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: githubId,
          },
        },
      })

      if (!account) {
        await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId,
            userId: user.id,
          },
        })
      }

      const tokenPayload = {
        sub: user.id,
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
