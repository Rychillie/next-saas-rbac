import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import { env } from '@nsr/env'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { auth } from './routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js Saas',
      description: 'Full-stack Saas app with multi-tenancy & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

const {
  authenticateWithGithub,
  authenticateWithPassword,
  createAccount,
  getProfile,
  requestPasswordRecover,
  resetPassword,
} = auth

app.register(authenticateWithGithub)
app.register(authenticateWithPassword)
app.register(createAccount)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('Server is running on port 3333')
})
