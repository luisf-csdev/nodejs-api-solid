import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const firstGymTitle = 'JavaScript Gym'
    const secondGymTitle = 'TypeScript Gym'

    const [query] = firstGymTitle.split(' ')

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: firstGymTitle,
        description: 'Some description.',
        phone: '551199999999',
        latitude: 25.809581,
        longitude: -80.208504,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: secondGymTitle,
        description: 'Some description.',
        phone: '551199999999',
        latitude: 25.809581,
        longitude: -80.208504,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ q: query })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: firstGymTitle,
      }),
    ])
  })
})
