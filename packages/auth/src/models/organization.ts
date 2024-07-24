import { z } from 'zod'

export const organizationSchema = z.object({
  __typename: z.literal('Organization').default('Organization'),
  id: z.string().uuid(),
  ownerId: z.string(),
})

export type Organization = z.infer<typeof organizationSchema>
