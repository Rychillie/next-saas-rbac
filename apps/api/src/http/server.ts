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
import { auth, members, orgs, projects } from './routes'

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
  configuration: {
    authentication: {
      preferredSecurityScheme: 'bearerAuth',
      http: {
        bearer: {
          token: env.DOCS_AUTHENTICATION_BEARER_TOKEN,
        },
      },
    },
  },
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(auth.authenticateWithGithub)
app.register(auth.authenticateWithPassword)
app.register(auth.createAccount)
app.register(auth.getProfile)
app.register(auth.requestPasswordRecover)
app.register(auth.resetPassword)

app.register(members.getMembers)

app.register(orgs.createOrganizations)
app.register(orgs.getMembership)
app.register(orgs.getOrganization)
app.register(orgs.getOrganizations)
app.register(orgs.shutdownOrganization)
app.register(orgs.transferOrganization)
app.register(orgs.updateOrganization)

app.register(projects.createProject)
app.register(projects.deleteProject)
app.register(projects.getProject)
app.register(projects.getProjects)
app.register(projects.updateProject)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('Server is running on port 3333')
})
