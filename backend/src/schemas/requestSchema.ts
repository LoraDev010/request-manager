import { z } from 'zod'

export const createRequestSchema = z.object({
  title: z.string({ required_error: 'title is required' }).min(1, 'title cannot be empty'),
})

export const updateRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    required_error: 'status is required',
    invalid_type_error: 'status must be APPROVED or REJECTED',
  }),
})

export type CreateRequestDto = z.infer<typeof createRequestSchema>
export type UpdateRequestDto = z.infer<typeof updateRequestSchema>
