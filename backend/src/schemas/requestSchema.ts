import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
})

export const createRequestSchema = z.object({
  title: z.string({ required_error: 'title is required' }).min(1, 'title cannot be empty').max(500, 'title cannot exceed 500 characters'),
}).strict()

export const updateRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    required_error: 'status is required',
    invalid_type_error: 'status must be APPROVED or REJECTED',
  }),
}).strict()

export type CreateRequestDto = z.infer<typeof createRequestSchema>
export type UpdateRequestDto = z.infer<typeof updateRequestSchema>
