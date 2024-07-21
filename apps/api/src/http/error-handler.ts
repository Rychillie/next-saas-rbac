import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { Error } from '@/http/routes'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof Error.BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof Error.UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  console.error(error)

  // send error to some observability platform

  return reply.status(500).send({ message: 'Internal server error' })
}
