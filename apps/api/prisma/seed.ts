import { faker } from '@faker-js/faker'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcryptjs'
import dotenv from 'dotenv'

import { PrismaClient } from '../src/generated/prisma/client'

dotenv.config()

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 1)

  const [user, anotherUser, thirdUser] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'jhon@mail.com',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash,
      },
    }),
  ])

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      projects: {
        create: [
          {
            name: faker.lorem.words(5),
            slug: faker.lorem.slug(5),
            description: faker.lorem.paragraph(),
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: faker.helpers.arrayElement([
              user.id,
              anotherUser.id,
              thirdUser.id,
            ]),
          },
          {
            name: faker.lorem.words(5),
            slug: faker.lorem.slug(5),
            description: faker.lorem.paragraph(),
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: faker.helpers.arrayElement([
              user.id,
              anotherUser.id,
              thirdUser.id,
            ]),
          },
          {
            name: faker.lorem.words(5),
            slug: faker.lorem.slug(5),
            description: faker.lorem.paragraph(),
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: faker.helpers.arrayElement([
              user.id,
              anotherUser.id,
              thirdUser.id,
            ]),
          },
        ],
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser.id,
              role: 'MEMBER',
            },
            {
              userId: thirdUser.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                thirdUser.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },
            {
              userId: thirdUser.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                thirdUser.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'BILLING',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },
            {
              userId: thirdUser.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })
}

seed().then(async () => {
  console.log('Seeding finished.')
})
