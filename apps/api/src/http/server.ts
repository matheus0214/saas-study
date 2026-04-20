import fastifyCors from '@fastify/cors'
import dotenv from 'dotenv'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createAccount } from './routes/auth/create-account'

dotenv.config()

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.register(createAccount)

app.listen({ port: 3333 }, () => {
  console.log('Server is running on port 3333')
})
