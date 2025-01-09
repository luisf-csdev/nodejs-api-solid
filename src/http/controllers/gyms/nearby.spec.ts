import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const nearbyGym = {
      title: 'JavaScript Gym',
      description: 'Some description.',
      phone: '551199999999',
      latitude: 25.809581,
      longitude: -80.208504,
    }

    const distantGym = {
      title: 'JavaScript Gym',
      description: 'Some description.',
      phone: '551199999999',
      latitude: 40.730277,
      longitude: -73.753088,
    }

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(nearbyGym)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(distantGym)

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: nearbyGym.latitude,
        longitude: nearbyGym.longitude,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: nearbyGym.title,
      }),
    ])
  })
})
