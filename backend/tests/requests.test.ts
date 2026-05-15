import request from 'supertest'
import app from '../src/app'

describe('POST /requests', () => {
  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/requests').send({})
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 400 when title is empty string', async () => {
    const res = await request(app).post('/requests').send({ title: '' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 201 with PENDING status on valid request', async () => {
    const res = await request(app).post('/requests').send({ title: 'New request' })
    expect(res.status).toBe(201)
    expect(res.body.data.status).toBe('PENDING')
    expect(res.body.data.title).toBe('New request')
    expect(res.body.error).toBeNull()
  })
})

describe('GET /requests', () => {
  it('returns 200 with data array', async () => {
    const res = await request(app).get('/requests')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.error).toBeNull()
  })

})

describe('PATCH /requests/:id', () => {
  let requestId: string

  beforeEach(async () => {
    const res = await request(app).post('/requests').send({ title: 'Test request' })
    requestId = res.body.data.id
  })

  it('returns 200 when approving a PENDING request', async () => {
    const res = await request(app).patch(`/requests/${requestId}`).send({ status: 'APPROVED' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('APPROVED')
  })

  it('returns 200 when rejecting a PENDING request', async () => {
    const res = await request(app).patch(`/requests/${requestId}`).send({ status: 'REJECTED' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('REJECTED')
  })

  it('returns 409 when approving an already APPROVED request', async () => {
    await request(app).patch(`/requests/${requestId}`).send({ status: 'APPROVED' })
    const res = await request(app).patch(`/requests/${requestId}`).send({ status: 'APPROVED' })
    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('REQUEST_ALREADY_PROCESSED')
  })

  it('returns 409 when rejecting an already REJECTED request', async () => {
    await request(app).patch(`/requests/${requestId}`).send({ status: 'REJECTED' })
    const res = await request(app).patch(`/requests/${requestId}`).send({ status: 'REJECTED' })
    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('REQUEST_ALREADY_PROCESSED')
  })

  it('returns 400 when id is not a valid UUID', async () => {
    const res = await request(app).patch('/requests/non-existent-id').send({ status: 'APPROVED' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 404 when request does not exist', async () => {
    const res = await request(app).patch('/requests/00000000-0000-0000-0000-000000000000').send({ status: 'APPROVED' })
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('REQUEST_NOT_FOUND')
  })

  it('returns 400 when status value is invalid', async () => {
    const res = await request(app).patch(`/requests/${requestId}`).send({ status: 'INVALID' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })
})
