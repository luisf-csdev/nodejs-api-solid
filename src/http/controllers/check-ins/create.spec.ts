import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gymLatitude = 25.809581
    const gymLongitude = -80.208504

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: gymLatitude,
        longitude: gymLongitude,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: gymLatitude,
        longitude: gymLongitude,
      })

    expect(response.statusCode).toEqual(201)
  })
})
